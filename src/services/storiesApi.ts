import { User } from 'firebase/auth';
import { Story } from '../types';

export interface PublishStoryPayload {
  title: string;
  summary?: string;
  fullStory: string;
  petName?: string;
  species?: 'dog' | 'cat';
  adopterName?: string;
  adoptDate?: string;
  beforeImage?: string;
  afterImage?: string;
  quote?: string;
  draftId: string;
  source?: 'n8n_ai_marketing' | 'admin';
}

export interface SubmitCommunityStoryPayload {
  title: string;
  fullStory: string;
  summary?: string;
  petName?: string;
  species?: 'dog' | 'cat';
  adopterName?: string;
  adoptDate?: string;
  beforeImage?: string;
  afterImage?: string;
  quote?: string;
}

export async function fetchPublishedStories(): Promise<Story[]> {
  const response = await fetch('/api/stories', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Không thể tải danh sách bài viết (mã ${response.status}).`);
  }

  return Array.isArray(data.stories) ? data.stories : [];
}

export async function publishStory(
  payload: PublishStoryPayload,
  user: User | null
): Promise<{ story: Story; alreadyExisted?: boolean }> {
  if (!user) {
    throw new Error('Vui lòng đăng nhập tài khoản quản trị viên để đăng bài.');
  }

  const idToken = await user.getIdToken();

  const response = await fetch('/api/stories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Không thể đăng bài lên Góc yêu thương (mã ${response.status}).`);
  }

  return {
    story: data.story,
    alreadyExisted: Boolean(data.alreadyExisted),
  };
}

export async function submitCommunityStory(
  payload: SubmitCommunityStoryPayload
): Promise<{ message: string }> {
  const response = await fetch('/api/stories/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Không thể gửi câu chuyện (mã ${response.status}).`);
  }

  return {
    message: data.message || 'Đã gửi câu chuyện để xét duyệt',
  };
}
