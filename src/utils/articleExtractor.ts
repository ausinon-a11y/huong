export interface ExtractedArticle {
  title: string;
  summary: string;
  content: string;
}

const AI_PREAMBLE_PATTERNS = [
  /^(?:xin\s+)?chào\s+bạn\b/i,
  /^chào\s+mừng\b/i,
  /tôi\s+là\s+ai\s+marketing\s+agent/i,
  /trợ\s+lý\s+(?:ai|marketing)/i,
  /tôi\s+đã\s+sẵn\s+sàng\s+hỗ\s+trợ/i,
  /^(?:để\s+(?:viết|tạo|thực\s+hiện|xây\s+dựng)|với\s+yêu\s+cầu|dựa\s+(?:trên|vào)\s+yêu\s+cầu).*?(?:kỹ\s+năng|skill|copywriting|storytelling|framework|nguyên\s+tắc|công\s+thức)/i,
  /^(?:tôi|mình)\s+(?:sẽ|đã)\s+(?:áp\s+dụng|sử\s+dụng|kết\s+hợp)\s+(?:kỹ\s+năng|skill|phương\s+pháp|công\s+thức)/i,
  /^(?:dưới\s+đây\s+là|sau\s+đây\s+là|đây\s+là)\s+(?:bài\s+(?:viết|đăng|chia\s+sẻ)|câu\s+chuyện|nội\s+dung|bản\s+nháp|mẫu\s+bài)/i,
  /^(?:gợi\s+ý\s+(?:bài\s+(?:viết|đăng)|nội\s+dung)|bản\s+nháp\s+bài\s+viết|bài\s+viết\s+dành\s+cho\s+góc\s+yêu\s+thương)\s*:?\s*$/i,
];

const AI_META_SECTION_HEADER_PATTERNS = [
  /^(?:phân\s+tích|chiến\s+lược|kỹ\s+năng\s+(?:đã\s+)?(?:áp\s+dụng|sử\s+dụng)|7\s+marketing\s+skills?|ghi\s+chú(?:\s+triển\s+khai)?|lưu\s+ý(?:\s+(?:khi\s+đăng|triển\s+khai|cho\s+quản\s+trị))?|gợi\s+ý\s+(?:hình\s+ảnh|ảnh\s+kèm|thời\s+gian\s+đăng|kênh|hashtag|cta|tối\s+ưu)|kế\s+hoạch\s+(?:đăng\s+bài|truyền\s+thông)|mục\s+tiêu\s+bài\s+viết|tại\s+sao\s+bài\s+viết\s+này)\b/i,
];

const AI_OUTRO_PATTERNS = [
  /^(?:hy\s+vọng|mong\s+rằng|chúc\s+(?:bạn|trạm|cpaps))/i,
  /^(?:nếu\s+bạn\s+(?:muốn|cần)|bạn\s+có\s+muốn|hãy\s+(?:cho\s+tôi\s+biết|nhắn\s+(?:cho\s+)?tôi)|bạn\s+cần\s+(?:chỉnh|thay\s+đổi|bổ\s+sung))/i,
  /^(?:tôi\s+có\s+thể\s+(?:điều\s+chỉnh|chỉnh\s+sửa|viết\s+lại))/i,
];

function stripMarkdownFormatting(text: string): string {
  return text
    .replace(/^#{1,6}\s+/, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/^[*_#\s]+|[*_\s]+$/g, '')
    .replace(/^["“”'«»]+|["“”'«»]+$/g, '')
    .trim();
}

function isDividerLine(line: string): boolean {
  return /^\s*(?:---+|===+|\*\*\*+)\s*$/.test(line);
}

function isMetaBlock(block: string): boolean {
  const lines = block
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return true;

  const firstLineClean = stripMarkdownFormatting(lines[0]);
  if (AI_PREAMBLE_PATTERNS.some((re) => re.test(firstLineClean))) {
    return lines.length <= 4;
  }
  if (AI_META_SECTION_HEADER_PATTERNS.some((re) => re.test(firstLineClean))) {
    return true;
  }
  if (AI_OUTRO_PATTERNS.some((re) => re.test(firstLineClean))) {
    return lines.length <= 4;
  }

  // Detect pure markdown strategy tables (e.g., "| Kênh | Thời gian | Mục tiêu |")
  const tableLines = lines.filter((l) => l.startsWith('|') && l.endsWith('|'));
  if (tableLines.length >= 2 && tableLines.length === lines.length) {
    return true;
  }

  return false;
}

function deriveConciseTitle(body: string): string {
  const firstParagraph = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .find(Boolean);
  if (!firstParagraph) return '';

  const clean = stripMarkdownFormatting(firstParagraph.replace(/\n+/g, ' '));
  const sentenceMatch = clean.match(/^(.{12,110}?)[.!?](?:\s|$)/);
  if (sentenceMatch && sentenceMatch[1]) {
    return sentenceMatch[1].trim();
  }
  if (clean.length <= 95) return clean;
  return `${clean.slice(0, 92).replace(/\s+\S*$/, '').trim()}...`;
}

function matchLabeledLine(line: string, labelsRegex: string): { matched: boolean; value: string } {
  const cleanedLine = line.replace(/^#{1,6}\s+/, '').trim();
  // Remove bold/italic markers so both "**Tiêu đề:** abc" and "**Tiêu đề**: abc" normalize identically
  const unformatted = cleanedLine
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .trim();

  const regex = new RegExp(`^(?:${labelsRegex})\\s*:\\s*(.*)$`, 'i');
  const m = unformatted.match(regex);
  if (!m) return { matched: false, value: '' };
  return { matched: true, value: stripMarkdownFormatting(m[1] || '') };
}

/**
 * Extracts only the clean, publication-ready article (title, optional summary, body)
 * from raw n8n AI Marketing Agent output, stripping AI greetings, skill explanations,
 * strategy notes, and conversational sign-offs.
 */
export function extractCleanArticleFromMarketingOutput(rawOutput: string): ExtractedArticle {
  const normalized = (rawOutput || '').replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return { title: '', summary: '', content: '' };
  }

  // 1. If horizontal rules (---) separate AI chatter from the article, drop meta blocks.
  const hrSections = normalized
    .split(/\n\s*(?:---+|===+|\*\*\*+)\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  let workingText = normalized;
  if (hrSections.length > 1) {
    const contentSections = hrSections.filter((sec) => !isMetaBlock(sec));
    if (contentSections.length > 0) {
      workingText = contentSections.join('\n\n');
    }
  }

  // 2. Strip leading AI greeting / skill-announcement paragraphs or lines
  let paragraphs = workingText
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  while (paragraphs.length > 1) {
    const head = paragraphs[0];
    const headLines = head.split('\n').map((l) => l.trim()).filter(Boolean);
    const firstLineClean = stripMarkdownFormatting(headLines[0] || '');

    const isPreamblePara =
      AI_PREAMBLE_PATTERNS.some((re) => re.test(firstLineClean)) &&
      headLines.every(
        (line) =>
          isDividerLine(line) ||
          AI_PREAMBLE_PATTERNS.some((re) => re.test(stripMarkdownFormatting(line))) ||
          headLines.length <= 2
      );

    if (isPreamblePara) {
      paragraphs.shift();
      continue;
    }

    if (headLines.length > 1 && AI_PREAMBLE_PATTERNS.some((re) => re.test(firstLineClean))) {
      const remainingLines = [...headLines];
      while (
        remainingLines.length > 1 &&
        (isDividerLine(remainingLines[0]) ||
          AI_PREAMBLE_PATTERNS.some((re) => re.test(stripMarkdownFormatting(remainingLines[0]))))
      ) {
        remainingLines.shift();
      }
      if (remainingLines.length > 0 && remainingLines.length < headLines.length) {
        paragraphs[0] = remainingLines.join('\n');
      }
    }
    break;
  }

  if (paragraphs.length === 1) {
    const lines = paragraphs[0].split('\n');
    while (
      lines.length > 1 &&
      (!lines[0].trim() ||
        isDividerLine(lines[0]) ||
        AI_PREAMBLE_PATTERNS.some((re) => re.test(stripMarkdownFormatting(lines[0]))))
    ) {
      lines.shift();
    }
    paragraphs[0] = lines.join('\n').trim();
  }

  // 3. Remove trailing AI meta-sections and conversational sign-offs
  const metaSplitIndex = paragraphs.findIndex((p, idx) => {
    if (idx === 0) return false;
    const firstLine = stripMarkdownFormatting((p.split('\n')[0] || '').trim());
    return AI_META_SECTION_HEADER_PATTERNS.some((re) => re.test(firstLine));
  });
  if (metaSplitIndex > 0) {
    paragraphs = paragraphs.slice(0, metaSplitIndex);
  }

  while (paragraphs.length > 1) {
    const tail = paragraphs[paragraphs.length - 1];
    const tailFirstLine = stripMarkdownFormatting((tail.split('\n')[0] || '').trim());
    if (AI_OUTRO_PATTERNS.some((re) => re.test(tailFirstLine)) || isMetaBlock(tail)) {
      paragraphs.pop();
      continue;
    }
    break;
  }

  if (paragraphs.length >= 1) {
    const lastLines = paragraphs[paragraphs.length - 1].split('\n');
    while (
      lastLines.length > 1 &&
      (!lastLines[lastLines.length - 1].trim() ||
        isDividerLine(lastLines[lastLines.length - 1]) ||
        AI_OUTRO_PATTERNS.some((re) =>
          re.test(stripMarkdownFormatting(lastLines[lastLines.length - 1]))
        ))
    ) {
      lastLines.pop();
    }
    paragraphs[paragraphs.length - 1] = lastLines.join('\n').trim();
  }

  let body = paragraphs.filter(Boolean).join('\n\n').trim();

  if (
    (body.startsWith('"') && body.endsWith('"')) ||
    (body.startsWith('“') && body.endsWith('”'))
  ) {
    body = body.slice(1, -1).trim();
  }

  // 4. Extract Title & optional Summary cleanly without leaving duplicate headings or ** markers
  let title = '';
  let summary = '';

  const lines = body.split('\n');
  while (lines.length > 0 && !lines[0].trim()) lines.shift();

  if (lines.length > 0) {
    const first = lines[0].trim();
    const labelTitle = matchLabeledLine(first, 'tiêu\\s+đề|title|chủ\\s+đề');
    const mdHeading = first.match(/^#{1,3}\s+(.+)$/);
    const boldHeadline =
      /^\*\*(.+?)\*\*$/.test(first) && first.length <= 150 && lines.length > 1;
    const plainShortHeadline =
      lines.length > 1 &&
      !lines[1].trim() &&
      first.length >= 8 &&
      first.length <= 110 &&
      !/[.!?…:]$/.test(first) &&
      !/^[-*•\d]/.test(first);

    if (labelTitle.matched && labelTitle.value) {
      title = labelTitle.value.slice(0, 200);
      lines.shift();
    } else if (mdHeading && mdHeading[1]) {
      title = stripMarkdownFormatting(mdHeading[1]).slice(0, 200);
      lines.shift();
    } else if (boldHeadline) {
      title = stripMarkdownFormatting(first).slice(0, 200);
      lines.shift();
    } else if (plainShortHeadline) {
      title = stripMarkdownFormatting(first).slice(0, 200);
      lines.shift();
    }
  }

  while (lines.length > 0 && (!lines[0].trim() || isDividerLine(lines[0]))) {
    lines.shift();
  }

  if (lines.length > 1) {
    const summaryLabel = matchLabeledLine(lines[0], 'tóm\\s+tắt|sapo|mô\\s+tả\\s+ngắn');
    if (summaryLabel.matched && summaryLabel.value) {
      summary = summaryLabel.value.slice(0, 500);
      lines.shift();
      while (lines.length > 0 && !lines[0].trim()) lines.shift();
    }
  }

  if (lines.length > 0) {
    const contentLabel = matchLabeledLine(lines[0], 'nội\\s+dung(?:\\s+bài\\s+(?:viết|đăng))?|bài\\s+viết');
    if (contentLabel.matched) {
      if (contentLabel.value) {
        lines[0] = contentLabel.value;
      } else {
        lines.shift();
        while (lines.length > 0 && !lines[0].trim()) lines.shift();
      }
    }
  }

  const cleanContent = lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!title && cleanContent) {
    title = deriveConciseTitle(cleanContent).slice(0, 200);
  }

  return {
    title,
    summary,
    content: cleanContent || body,
  };
}
