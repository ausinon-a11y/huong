import React, { useState } from 'react';
import { User } from 'firebase/auth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  Send,
  Bot,
  Copy,
  Check,
  Lock,
  LogIn,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  SendHorizontal,
  ArrowRight,
  Edit3,
} from 'lucide-react';
import { googleSignIn, signOut } from '../services/auth';
import { sendMarketingPrompt, isUserAdmin } from '../services/marketingApi';
import { publishStory } from '../services/storiesApi';
import { extractCleanArticleFromMarketingOutput } from '../utils/articleExtractor';
import { Story } from '../types';

interface MarketingViewProps {
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  onToast: (msg: string) => void;
  onStoryPublished: (story: Story) => void;
  onOpenStories: () => void;
}

export const MarketingView: React.FC<MarketingViewProps> = ({
  currentUser,
  onUserChange,
  onToast,
  onStoryPublished,
  onOpenStories,
}) => {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Clean extracted article draft for Góc yêu thương
  const [draftId, setDraftId] = useState<string>('');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftSummary, setDraftSummary] = useState('');
  const [draftContent, setDraftContent] = useState('');

  // Publish state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishedStory, setPublishedStory] = useState<Story | null>(null);

  const isAdmin = isUserAdmin(currentUser);

  const handleLogin = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        onUserChange(res.user);
        onToast(`Đã đăng nhập: ${res.user.email}`);
      }
    } catch (err: any) {
      onToast(`Lỗi đăng nhập: ${err.message || 'Không thể xác thực'}`);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setPublishError(null);
    setPublishedStory(null);

    const requestText = prompt.trim();

    try {
      const responseOutput = await sendMarketingPrompt(requestText, currentUser);
      setOutput(responseOutput);

      // Extract only the clean, publication-ready article content (strip AI greeting & meta chatter)
      const extracted = extractCleanArticleFromMarketingOutput(responseOutput);
      const newDraftId = `draft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      setDraftId(newDraftId);
      setDraftTitle(extracted.title);
      setDraftSummary(extracted.summary);
      setDraftContent(extracted.content || responseOutput);
      setPrompt('');

      onToast('AI Marketing Agent đã tạo xong bản nháp bài đăng!');
    } catch (err: any) {
      const msg = err.message || 'Lỗi kết nối tới AI Marketing Agent';
      setErrorMessage(msg);
      onToast(`Lỗi: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishToStories = async () => {
    if (isPublishing || !draftId) return;

    if (!draftTitle.trim()) {
      setPublishError('Vui lòng nhập tiêu đề bài viết trước khi đăng lên Góc yêu thương.');
      return;
    }
    if (!draftContent.trim()) {
      setPublishError('Nội dung bài viết không được để trống.');
      return;
    }

    setIsPublishing(true);
    setPublishError(null);

    try {
      const { story, alreadyExisted } = await publishStory(
        {
          title: draftTitle.trim(),
          summary: draftSummary.trim() || undefined,
          fullStory: draftContent.trim(),
          draftId,
          source: 'n8n_ai_marketing',
        },
        currentUser
      );

      setPublishedStory(story);
      onStoryPublished(story);
      onToast(
        alreadyExisted
          ? 'Bài viết từ bản nháp này đã được đăng trước đó.'
          : 'Đã đăng bài viết lên Góc yêu thương!'
      );
    } catch (err: any) {
      const msg = err.message || 'Không thể đăng bài lên Góc yêu thương.';
      setPublishError(msg);
      onToast(`Lỗi đăng bài: ${msg}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = draftContent || output;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    onToast('Đã sao chép nội dung bài viết vào clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  // 1. Case: Not Logged In
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#E3E2DF] shadow-sm text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-[#974729]/10 text-[#974729] rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#24150F]">
              Khu Vực AI Marketing Agent
            </h2>
            <p className="text-sm text-[#4F4541] leading-relaxed">
              Trang này dành riêng cho quản trị viên CPAPS để soạn bài từ AI Marketing Agent và đăng trực tiếp lên Góc yêu thương.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleLogin}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#974729] hover:bg-[#803a1f] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Đăng nhập tài khoản Google Quản trị
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Case: Logged In but Not Admin
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-amber-200 shadow-sm text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#24150F]">
              Yêu Cầu Quyền Quản Trị Viên
            </h2>
            <p className="text-sm text-[#4F4541] leading-relaxed">
              Bạn đang đăng nhập bằng email: <strong className="text-[#24150F]">{currentUser.email}</strong>. Email này hiện chưa nằm trong danh sách quản trị viên.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => signOut().then(() => onUserChange(null))}
              className="px-5 py-2.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Đăng xuất và đổi tài khoản
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Admin View: AI Marketing + Direct Publish to Góc yêu thương
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12 animate-fade-in space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#24150F] via-[#3a2218] to-[#974729] rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wide text-amber-200">
            <Sparkles className="w-3.5 h-3.5" /> n8n Marketing Agent
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            AI Marketing Agent Quản Trị
          </h1>
          <p className="text-white/80 text-sm md:text-base leading-relaxed">
            Nhập yêu cầu viết bài để nhận nội dung từ AI Marketing Agent, chỉnh sửa nhanh bài viết sạch và bấm đăng thẳng lên Góc yêu thương.
          </p>
        </div>

        <div className="absolute right-[-40px] bottom-[-40px] w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Free-form Prompt Input */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E3E2DF] shadow-sm space-y-5">
            <h3 className="font-extrabold text-lg text-[#24150F] flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#974729]" />
              Nhập Yêu Cầu Cho Marketing Agent
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-2">
                  Nội dung yêu cầu viết bài (tiếng Việt):
                </label>
                <textarea
                  rows={8}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ví dụ: Viết bài đăng Góc yêu thương kể về hành trình bé mèo Mướp hồi phục sau cứu hộ và tìm được mái ấm mới..."
                  className="w-full p-4 rounded-2xl border border-[#817470]/30 focus:border-[#974729] focus:ring-2 focus:ring-[#974729]/20 text-sm leading-relaxed text-[#24150F] placeholder:text-[#817470]/60 resize-y transition-all"
                  disabled={isLoading}
                />
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">
                    <strong>Đã xảy ra lỗi:</strong> {errorMessage}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#974729] hover:bg-[#803a1f] disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-[#974729]/20 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Gửi Cho Agent</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: AI Output + Clean Article Draft & Direct Publish */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Raw Output Preview */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E3E2DF] shadow-sm flex flex-col min-h-[320px]">
            <div className="flex items-center justify-between border-b border-[#E3E2DF] pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#24150F]">
                    Phản Hồi Từ AI Marketing Agent
                  </h3>
                  <p className="text-xs text-[#817470]">
                    Kết quả gốc từ n8n Agent
                  </p>
                </div>
              </div>

              {output && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-gray-200 hover:bg-[#FAF9F5] text-xs font-semibold text-[#24150F] transition-all cursor-pointer"
                  title="Sao chép bài viết"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#817470]" />
                      <span>Sao chép bài viết</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center py-16 text-center space-y-4 text-[#817470]">
                  <div className="w-12 h-12 rounded-full border-4 border-[#974729]/20 border-t-[#974729] animate-spin" />
                  <p className="font-bold text-[#24150F] text-sm">
                    AI Marketing Agent đang soạn bài...
                  </p>
                </div>
              ) : output ? (
                <div className="bg-[#FAF9F5] p-5 md:p-6 rounded-2xl border border-[#E3E2DF] text-[#24150F]">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 className="text-xl md:text-2xl font-extrabold text-[#24150F] mt-5 mb-3 pb-2 border-b border-[#E3E2DF] first:mt-0 tracking-tight" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-lg md:text-xl font-bold text-[#24150F] mt-4 mb-2 first:mt-0" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-base font-bold text-[#974729] mt-3 mb-2 first:mt-0" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="text-sm text-[#382b26] leading-relaxed mb-3 last:mb-0" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-outside ml-5 mb-3 space-y-1.5 text-sm text-[#382b26] marker:text-[#974729]" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-outside ml-5 mb-3 space-y-1.5 text-sm text-[#382b26] marker:font-bold marker:text-[#974729]" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-[#974729] bg-white/70 pl-4 py-2 pr-3 my-3 rounded-r-xl italic text-sm text-[#4F4541]" {...props} />
                      ),
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-3 rounded-xl border border-[#E3E2DF]">
                          <table className="w-full text-left text-xs border-collapse bg-white" {...props} />
                        </div>
                      ),
                      th: ({ node, ...props }) => (
                        <th className="px-3 py-2 bg-[#EFEEEA] font-extrabold text-[#24150F] border-r border-[#E3E2DF] last:border-r-0" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="px-3 py-2 text-[#382b26] border-t border-r border-[#E3E2DF] last:border-r-0" {...props} />
                      ),
                    }}
                  >
                    {output}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-3 text-[#817470]">
                  <Bot className="w-12 h-12 text-[#817470]/40" />
                  <p className="font-semibold text-sm text-[#4F4541]">
                    Chưa có phản hồi nào
                  </p>
                  <p className="text-xs max-w-sm text-[#817470]">
                    Nhập yêu cầu ở khung bên trái để nhận bài viết từ AI Marketing Agent.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Clean Publication-Ready Draft Box */}
          {output && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E3E2DF] shadow-sm space-y-5">
              <div className="flex items-start gap-2.5 border-b border-[#E3E2DF] pb-4">
                <div className="w-9 h-9 rounded-xl bg-[#974729]/10 text-[#974729] flex items-center justify-center shrink-0">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#24150F]">
                    Bài Đăng Lên Góc Yêu Thương
                  </h3>
                  <p className="text-xs text-[#817470] mt-0.5">
                    Đã lọc bỏ phần chào hỏi và ghi chú của AI để giữ lại nội dung bài đăng hoàn chỉnh. Bạn có thể chỉnh sửa trước khi bấm đăng.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#4F4541] mb-1.5">
                    Tiêu đề bài viết <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    maxLength={200}
                    placeholder="Nhập tiêu đề bài đăng..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#817470]/35 bg-[#FAF9F5] focus:bg-white focus:border-[#974729] focus:ring-2 focus:ring-[#974729]/20 text-sm font-semibold text-[#24150F]"
                    disabled={isPublishing}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4F4541] mb-1.5">
                    Tóm tắt ngắn (tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    value={draftSummary}
                    onChange={(e) => setDraftSummary(e.target.value)}
                    maxLength={500}
                    placeholder="Có thể để trống hoặc viết 1 câu mở đầu ngắn..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#817470]/35 bg-[#FAF9F5] focus:bg-white focus:border-[#974729] focus:ring-2 focus:ring-[#974729]/20 text-sm text-[#24150F] resize-y"
                    disabled={isPublishing}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4F4541] mb-1.5">
                    Nội dung bài viết <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={9}
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    maxLength={20000}
                    placeholder="Nội dung bài viết sạch sẽ hiển thị trên Góc yêu thương..."
                    className="w-full p-4 rounded-2xl border border-[#817470]/35 bg-[#FAF9F5] focus:bg-white focus:border-[#974729] focus:ring-2 focus:ring-[#974729]/20 text-sm leading-relaxed text-[#24150F] resize-y"
                    disabled={isPublishing}
                  />
                </div>

                {publishError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="flex-1 leading-relaxed">{publishError}</div>
                  </div>
                )}

                {publishedStory && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5 text-xs text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">
                          Đã đăng bài &ldquo;{publishedStory.title}&rdquo; lên Góc yêu thương!
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenStories}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 cursor-pointer"
                    >
                      <span>Xem Góc yêu thương</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handlePublishToStories}
                    disabled={isPublishing || !draftTitle.trim() || !draftContent.trim()}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#23311B] hover:bg-[#172111] disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    {isPublishing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Đang đăng...</span>
                      </>
                    ) : (
                      <>
                        <SendHorizontal className="w-4 h-4" />
                        <span>
                          {publishedStory ? 'Đã đăng lên Góc yêu thương' : 'Đăng lên Góc yêu thương'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
