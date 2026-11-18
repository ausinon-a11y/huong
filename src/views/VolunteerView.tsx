import React, { useState } from 'react';
import { VOLUNTEER_ROLES } from '../data/mockData';
import { VolunteerRole } from '../types';
import { Users, Heart, Calendar, MapPin, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { trackVolunteerSubmit } from '../utils/analytics';

export const VolunteerView: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('vol-1');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    birthYear: '2000',
    experience: '',
    availableDays: 'Cuối tuần (T7, CN)',
    motivation: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackVolunteerSubmit(selectedRole, formData.availableDays);
    setIsSubmitted(true);
  };

  return (
    <div className="py-8 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto space-y-12">
      {/* Hero Header */}
      <div className="bg-[#EFEEEA] p-8 md:p-12 rounded-[2.5rem] border border-[#E3E2DF] text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#974729] bg-[#974729]/10 px-3.5 py-1.5 rounded-full">
          Gia nhập đại gia đình tình nguyện
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#24150F] mt-3">
          Cùng Nhau Lan Tỏa Yêu Thương
        </h1>
        <p className="text-sm sm:text-base text-[#4F4541] mt-3 max-w-2xl mx-auto leading-relaxed">
          Không cần phải là bác sĩ hay chuyên gia, chỉ cần một trái tim biết đồng cảm và vài giờ rảnh rỗi mỗi tuần, bạn đã có thể mang lại niềm vui lớn lao cho hàng trăm bé chó mèo tại Trạm.
        </p>
      </div>

      {/* Roles Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24150F]">
            Các Vị Trí Đang Mở Đăng Ký
          </h2>
          <p className="text-xs sm:text-sm text-[#4F4541] mt-1">
            Chọn vị trí phù hợp nhất với sở trường và quỹ thời gian của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VOLUNTEER_ROLES.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-6 sm:p-8 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#974729] shadow-xl ring-2 ring-[#974729]/20'
                    : 'bg-white/60 border-[#E3E2DF] hover:border-[#817470]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-[#974729] bg-[#974729]/10 px-3 py-1 rounded-full">
                      Còn {role.spotsAvailable} chỉ tiêu
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-[#974729]" />
                    )}
                  </div>

                  <h3 className="font-extrabold text-xl text-[#24150F] mb-2">
                    {role.title}
                  </h3>

                  <div className="space-y-1 text-xs text-[#4F4541] mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#974729]" />
                      <span>{role.commitment}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#974729]" />
                      <span>{role.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#4F4541] leading-relaxed mb-4">
                    {role.description}
                  </p>

                  <div className="space-y-2 border-t border-[#EFEEEA] pt-4">
                    <span className="text-xs font-bold text-[#24150F] block">Công việc chính:</span>
                    <ul className="text-xs text-[#4F4541] space-y-1 pl-3 list-disc">
                      {role.tasks.map((task, idx) => (
                        <li key={idx}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EFEEEA]">
                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-full text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#974729] text-white'
                        : 'bg-[#EFEEEA] text-[#24150F] hover:bg-[#E3E2DF]'
                    }`}
                  >
                    {isSelected ? 'Đã Chọn Vị Trí Này' : 'Chọn Vị Trí Này'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Application Form */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-[#E3E2DF] max-w-3xl mx-auto shadow-sm">
        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-[#87977A]/20 text-[#23311B] rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-10 h-10 text-[#87977A]" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#24150F]">
              Đăng Ký Thành Công! Chào Mừng Bạn Đến Với Đội Ngũ!
            </h3>
            <p className="text-sm text-[#4F4541] max-w-md mx-auto leading-relaxed">
              Trưởng nhóm tình nguyện viên của Trạm sẽ liên hệ qua Zalo/Điện thoại trong vòng 48 giờ để gửi tài liệu hướng dẫn và xếp lịch định hướng cho bạn.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-[#974729] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#803a1f]"
            >
              Gửi Đơn Khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b border-[#E3E2DF] pb-4">
              <h3 className="text-2xl font-extrabold text-[#24150F] flex items-center gap-2">
                <Users className="w-6 h-6 text-[#974729]" />
                Đăng Ký Trở Thành Tình Nguyện Viên
              </h3>
              <p className="text-xs text-[#817470] mt-1">
                Điền thông tin để chúng tôi sắp xếp lịch tập huấn và kết nối bạn với nhóm phụ trách
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ví dụ: Hoàng Minh Châu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Số điện thoại (Zalo) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0988 xxx xxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Khung thời gian có thể tham gia
                </label>
                <select
                  value={formData.availableDays}
                  onChange={(e) => setFormData({ ...formData, availableDays: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                >
                  <option value="Cuối tuần (T7, CN)">Cuối tuần (Thứ 7 & Chủ Nhật)</option>
                  <option value="Các ngày trong tuần (T2 - T6)">Các ngày trong tuần (Thứ 2 - Thứ 6)</option>
                  <option value="Linh hoạt theo ca">Linh hoạt theo thông báo của Trạm</option>
                  <option value="Làm việc online / Từ xa">Hỗ trợ online (Nội dung, thiết kế, truyền thông)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                Lý do bạn muốn tham gia & Kinh nghiệm nuôi thú cưng
              </label>
              <textarea
                rows={3}
                required
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                placeholder="Hãy chia sẻ ngắn gọn về tình cảm của bạn với các bé cún/mèo..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#974729] text-white py-3.5 rounded-full font-bold text-base hover:bg-[#803a1f] shadow-lg shadow-[#974729]/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Gửi Đơn Đăng Ký Tình Nguyện Viên</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
