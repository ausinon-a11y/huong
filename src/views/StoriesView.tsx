import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Story } from '../types';
import { SubmitCommunityStoryPayload } from '../services/storiesApi';
import {
  Calendar,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  BookOpen,
} from 'lucide-react';

interface StoriesViewProps {
  stories: Story[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onSubmitCommunityStory: (payload: SubmitCommunityStoryPayload) => Promise<{ message: string }>;
}

export const StoriesView: React.FC<StoriesViewProps> = ({
  stories,
  isLoading,
  error,
  onRetry,
  onSubmitCommunityStory,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [formData, setFormData] = useState({
    petName: '',
    adopterName: '',
    adoptDate: '',
    title: '',
    summary: '',
    fullStory: '',
    quote: '',
    beforeImage: '',
    afterImage: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('Đã gửi câu chuyện để xét duyệt');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      petName: '',
      adopterName: '',
      adoptDate: '',
      title: '',
      summary: '',
      fullStory: '',
      quote: '',
      beforeImage: '',
      afterImage: '',
    });
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await onSubmitCommunityStory({
        title: formData.title.trim(),
        fullStory: formData.fullStory.trim(),
        summary: formData.summary.trim() || undefined,
        petName: formData.petName.trim() || undefined,
        adopterName: formData.adopterName.trim() || undefined,
        adoptDate: formData.adoptDate.trim() || undefined,
        quote: formData.quote.trim() || undefined,
        beforeImage: formData.beforeImage.trim() || undefined,
        afterImage: formData.afterImage.trim() || undefined,
      });

      setSubmittedMessage(result.message || 'Đã gửi câu chuyện để xét duyệt');
      setSubmitted(true);
      resetForm();
    } catch (err: any) {
      setSubmitError(err.message || 'Không thể gửi câu chuyện lúc này. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto space-y-12">
      {/* Header Banner */}
      <div className="bg-[#EFEEEA] p-8 md:p-12 rounded-[2.5rem] border border-[#E3E2DF] text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#974729] bg-[#974729]/10 px-3.5 py-1.5 rounded-full">
          Sự thay đổi kỳ diệu
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#24150F] mt-3">
          Góc Yêu Thương & Hành Trình Tái Sinh
        </h1>
        <p className="text-sm sm:text-base text-[#4F4541] mt-3 max-w-2xl mx-auto leading-relaxed">
          Mỗi bức ảnh, mỗi câu chuyện là một minh chứng rằng tình yêu thương có thể chữa lành mọi tổn thương. Hãy cùng đọc và chia sẻ câu chuyện của chính bé nhà bạn!
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              setSubmitted(false);
              setSubmitError(null);
              setShowShareModal(true);
            }}
            className="bg-[#974729] text-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-[#803a1f] shadow-lg shadow-[#974729]/20 flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Kể Câu Chuyện Của Bé Nhà Bạn</span>
          </button>
        </div>
      </div>

      {/* Stories List / Loading / Error / Empty */}
      {isLoading ? (
        <div className="bg-white rounded-[2.5rem] p-12 border border-[#E3E2DF] text-center space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-[#974729]/20 border-t-[#974729] animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#4F4541]">
            Đang tải bài viết từ Góc yêu thương...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-[2.5rem] p-10 border border-red-200 text-center space-y-4 max-w-2xl mx-auto">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-red-900">
              Không thể tải danh sách bài viết
            </h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Thử lại</span>
          </button>
        </div>
      ) : stories.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-12 border border-dashed border-[#E3E2DF] text-center space-y-3 max-w-2xl mx-auto">
          <BookOpen className="w-10 h-10 text-[#817470]/60 mx-auto" />
          <h3 className="text-xl font-extrabold text-[#24150F]">Chưa có bài viết</h3>
          <p className="text-sm text-[#4F4541]">
            Các bài viết mới từ Góc yêu thương sẽ xuất hiện tại đây sau khi được xuất bản.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {stories.map((story) => {
            const hasBefore = Boolean(story.beforeImage);
            const hasAfter = Boolean(story.afterImage);
            const hasBothImages = hasBefore && hasAfter;
            const hasAnyImage = hasBefore || hasAfter;
            const hasMeta = Boolean(story.adoptDate || story.adopterName || story.petName);

            return (
              <article
                key={story.id}
                className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-[#E3E2DF] card-shadow-hover flex flex-col lg:flex-row gap-8 items-start"
              >
                {/* Render images only when author provided them */}
                {hasAnyImage && (
                  <div className="w-full lg:w-[440px] shrink-0 space-y-3">
                    {hasBothImages ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative rounded-2xl overflow-hidden h-64 bg-[#EFEEEA]">
                          <img
                            src={story.beforeImage}
                            alt={story.petName ? `${story.petName} lúc mới cứu hộ` : 'Lúc mới cứu hộ'}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-black/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                            Lúc mới cứu hộ
                          </div>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden h-64 bg-[#EFEEEA] ring-2 ring-[#974729]">
                          <img
                            src={story.afterImage}
                            alt={story.petName ? `${story.petName} hiện tại` : 'Hiện tại ấm êm'}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-[#974729] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow">
                            Hiện tại ấm êm
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden h-72 bg-[#EFEEEA]">
                        <img
                          src={story.afterImage || story.beforeImage}
                          alt={story.petName || story.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {story.petName && (
                      <p className="text-center text-xs text-[#817470] font-medium">
                        Hình ảnh hành trình của {story.petName}
                      </p>
                    )}
                  </div>
                )}

                {/* Story Body (supports full-width text-only articles cleanly) */}
                <div className="flex-1 min-w-0 space-y-4 w-full">
                  {hasMeta && (
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#974729]">
                      <Calendar className="w-4 h-4 shrink-0" />
                      {story.petName && <span>Bé: {story.petName}</span>}
                      {story.petName && (story.adoptDate || story.adopterName) && <span>•</span>}
                      {story.adoptDate && <span>Nhận nuôi ngày: {story.adoptDate}</span>}
                      {story.adoptDate && story.adopterName && <span>•</span>}
                      {story.adopterName && <span>Ba mẹ nhận nuôi: {story.adopterName}</span>}
                    </div>
                  )}

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24150F] leading-tight">
                    {story.title}
                  </h2>

                  {story.summary && (
                    <p className="text-sm sm:text-base font-medium text-[#6B5A53] leading-relaxed">
                      {story.summary}
                    </p>
                  )}

                  <div className="text-sm sm:text-base text-[#382b26] leading-relaxed space-y-3">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => (
                          <h3 className="text-xl font-extrabold text-[#24150F] mt-4 mb-2" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h4 className="text-lg font-bold text-[#24150F] mt-4 mb-2" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h5 className="text-base font-bold text-[#974729] mt-3 mb-1.5" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="leading-relaxed mb-3 last:mb-0" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc list-outside ml-5 mb-3 space-y-1.5 marker:text-[#974729]" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="list-decimal list-outside ml-5 mb-3 space-y-1.5 marker:text-[#974729] font-medium" {...props} />
                        ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote className="border-l-4 border-[#974729] bg-[#FAF9F5] pl-4 py-2 pr-3 my-3 rounded-r-xl italic text-[#4F4541]" {...props} />
                        ),
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-4 rounded-xl border border-[#E3E2DF]">
                            <table className="w-full text-left text-xs border-collapse bg-white" {...props} />
                          </div>
                        ),
                        th: ({ node, ...props }) => (
                          <th className="px-3 py-2 bg-[#EFEEEA] font-bold text-[#24150F] border-r border-[#E3E2DF] last:border-r-0" {...props} />
                        ),
                        td: ({ node, ...props }) => (
                          <td className="px-3 py-2 border-t border-r border-[#E3E2DF] last:border-r-0" {...props} />
                        ),
                      }}
                    >
                      {story.fullStory}
                    </ReactMarkdown>
                  </div>

                  {story.quote && (
                    <blockquote className="bg-[#EFEEEA]/60 p-5 rounded-2xl border-l-4 border-[#974729] text-[#24150F] text-sm font-medium italic">
                      {story.quote}
                    </blockquote>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Share Story Modal (Community Pending Submission) */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div
            className="bg-[#FAF9F5] w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl border border-[#E3E2DF] my-8 relative flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#E3E2DF] flex items-center justify-between bg-[#EFEEEA]">
              <h3 className="font-extrabold text-xl text-[#24150F]">
                Chia Sẻ Câu Chuyện Nhận Nuôi
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#24150F] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#87977A]/20 text-[#23311B] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-[#87977A]" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#24150F]">
                  {submittedMessage}
                </h3>
                <p className="text-sm text-[#4F4541] max-w-md mx-auto">
                  Câu chuyện của bạn đã được lưu ở trạng thái chờ duyệt và sẽ hiển thị công khai sau khi quản trị viên kiểm tra, xuất bản.
                </p>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="bg-[#974729] text-white px-8 py-3 rounded-full font-bold text-sm cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="overflow-y-auto p-6 md:p-8 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                    Tiêu đề câu chuyện *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ví dụ: Ngày đầu tiên rụt rè và một năm ngập tràn tiếng cười..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                      Tên bé cưng (tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={formData.petName}
                      onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                      placeholder="Ví dụ: Cún Bơ, Mèo Mun..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                      Tên của bạn / Gia đình (tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={formData.adopterName}
                      onChange={(e) => setFormData({ ...formData, adopterName: e.target.value })}
                      placeholder="Ví dụ: Gia đình chị Thùy Dung"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                    Nội dung câu chuyện *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.fullStory}
                    onChange={(e) => setFormData({ ...formData, fullStory: e.target.value })}
                    placeholder="Kể về hành trình thay đổi của bé, những kỷ niệm vui, khó khăn lúc đầu..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                    Lời nhắn gửi / Trích dẫn ý nghĩa (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="Ví dụ: Đừng mua chó mèo, hãy nhận nuôi và mở lòng..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                      Link ảnh lúc mới cứu hộ (tùy chọn)
                    </label>
                    <input
                      type="url"
                      value={formData.beforeImage}
                      onChange={(e) => setFormData({ ...formData, beforeImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                      Link ảnh hiện tại (tùy chọn)
                    </label>
                    <input
                      type="url"
                      value={formData.afterImage}
                      onChange={(e) => setFormData({ ...formData, afterImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowShareModal(false)}
                    className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#4F4541] cursor-pointer"
                    disabled={isSubmitting}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#974729] text-white px-8 py-2.5 rounded-full font-bold text-sm hover:bg-[#803a1f] disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                    <span>{isSubmitting ? 'Đang gửi...' : 'Gửi Câu Chuyện'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
