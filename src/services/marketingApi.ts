import { User } from 'firebase/auth';

export interface MarketingResponse {
  output: string;
  success: boolean;
  timestamp: string;
}

export const ADMIN_EMAILS = ['ausinon@gmail.com'];

export function isUserAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;
  const email = user.email.trim().toLowerCase();
  return ADMIN_EMAILS.includes(email);
}

/**
 * Sends a marketing prompt to backend /api/marketing/chat
 */
export async function sendMarketingPrompt(
  message: string,
  user: User | null,
  context?: string
): Promise<string> {
  if (!user || !user.email) {
    throw new Error('Vui lòng đăng nhập tài khoản quản trị viên để sử dụng AI Marketing Agent.');
  }

  const idToken = await user.getIdToken();

  const response = await fetch('/api/marketing/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
      'x-admin-email': user.email,
    },
    body: JSON.stringify({
      message: message.trim(),
      context: context || 'CPAPS - Trạm cứu hộ và nhận nuôi chó mèo Việt Nam',
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Lỗi máy chủ (${response.status}) khi gửi yêu cầu marketing.`);
  }

  return data.output || 'Không nhận được nội dung phản hồi từ AI Marketing Agent.';
}
