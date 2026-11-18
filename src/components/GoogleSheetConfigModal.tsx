import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  KeyRound, 
  Save, 
  RotateCw,
  LogOut,
  UserCheck
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  googleSignIn, 
  signOut, 
  getCachedAccessToken 
} from '../services/auth';
import { 
  getSavedSpreadsheetId, 
  saveSpreadsheetId, 
  createAdoptionSpreadsheet,
  getLocalAdoptions,
  appendAdoptionToSheet,
  markSubmissionSynced,
  DEFAULT_SPREADSHEET_ID
} from '../services/googleSheets';

interface GoogleSheetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  onToast: (msg: string) => void;
}

export const GoogleSheetConfigModal: React.FC<GoogleSheetConfigModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  onToast,
}) => {
  const [sheetIdInput, setSheetIdInput] = useState(getSavedSpreadsheetId() || DEFAULT_SPREADSHEET_ID);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [localSubmissions, setLocalSubmissions] = useState(getLocalAdoptions());

  useEffect(() => {
    if (isOpen) {
      setSheetIdInput(getSavedSpreadsheetId() || DEFAULT_SPREADSHEET_ID);
      setLocalSubmissions(getLocalAdoptions());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        onUserChange(res.user);
        onToast(`Đã kết nối tài khoản Google: ${res.user.email}`);
      }
    } catch (err: any) {
      onToast(`Lỗi đăng nhập: ${err.message || 'Không thể xác thực'}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onUserChange(null);
    onToast('Đã đăng xuất tài khoản Google');
  };

  const handleSaveSheetId = () => {
    let cleanId = sheetIdInput.trim();
    // If user pasted a full google docs URL, extract the ID:
    const match = cleanId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      cleanId = match[1];
      setSheetIdInput(cleanId);
    }

    saveSpreadsheetId(cleanId);
    onToast('Đã lưu cấu hình Google Sheet ID thành công!');
  };

  const handleCreateNewSheet = async () => {
    const token = getCachedAccessToken();
    if (!token) {
      onToast('Vui lòng Đăng nhập Google trước để tạo bảng tính tự động.');
      return;
    }

    try {
      setIsCreatingSheet(true);
      const newId = await createAdoptionSpreadsheet(token);
      setSheetIdInput(newId);
      onToast('Đã tạo thành công Bảng tính Google Sheet mới cho Trạm!');
    } catch (err: any) {
      onToast(`Không thể tạo bảng tính: ${err.message}`);
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleSyncLocalSubmissions = async (forceAll = false) => {
    const sheetId = sheetIdInput.trim() || getSavedSpreadsheetId();
    if (!sheetId) {
      onToast('Chưa có Google Sheet ID để đồng bộ.');
      return;
    }
    const token = getCachedAccessToken();
    if (!token) {
      onToast('Vui lòng bấm "Đăng nhập với Google" ở Bước 1 trước để có quyền ghi dữ liệu.');
      return;
    }

    const itemsToSync = forceAll ? localSubmissions : localSubmissions.filter(s => !s.syncedToGoogleSheet);
    if (itemsToSync.length === 0) {
      onToast('Không có đơn nào cần đồng bộ. Bạn có thể bấm "Đẩy lại tất cả vào Sheet".');
      return;
    }

    try {
      setIsSyncing(true);
      let count = 0;
      for (const item of itemsToSync) {
        // Mock pet object for append function
        const petObj = {
          id: item.petId,
          name: item.petName,
          breed: item.petBreed,
          species: (item.petBreed && item.petBreed.toLowerCase().includes('chó')) ? 'dog' : 'cat',
        } as any;

        await appendAdoptionToSheet(sheetId, petObj, item.formData, token);
        markSubmissionSynced(item.id);
        count++;
      }
      setLocalSubmissions(getLocalAdoptions());
      onToast(`Đã ghi thành công ${count} đơn vào đúng các cột bảng tính Google Sheet!`);
    } catch (err: any) {
      onToast(`Lỗi khi đồng bộ: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const activeSheetId = sheetIdInput.trim() || getSavedSpreadsheetId();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="bg-[#FAF9F5] w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl border border-[#E3E2DF] my-8 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E3E2DF] flex items-center justify-between bg-[#EFEEEA]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#24150F]">
                Kết Nối Google Sheets Nhận Đơn
              </h3>
              <p className="text-xs text-[#817470]">
                Tự động ghi toàn bộ đơn nhận nuôi của người đăng ký vào trang tính của bạn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-[#24150F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Google Account */}
          <div className="bg-white p-5 rounded-2xl border border-[#E3E2DF] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#974729]">
                Bước 1: Tài khoản Google quản trị
              </span>
              {currentUser ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <UserCheck className="w-3.5 h-3.5" /> Đã kết nối
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5" /> Chưa kết nối
                </span>
              )}
            </div>

            {currentUser ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="" className="w-9 h-9 rounded-full border border-gray-200" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#974729]/10 text-[#974729] flex items-center justify-center font-bold">
                      {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-[#24150F]">{currentUser.displayName || 'Quản trị viên'}</div>
                    <div className="text-xs text-[#817470]">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-red-600 hover:bg-red-50 transition-colors self-start sm:self-auto font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-[#4F4541] mb-3">
                  Đăng nhập tài khoản Google của bạn (hoặc tài khoản trạm cứu hộ) để cấp quyền ghi dữ liệu vào Google Sheets.
                </p>
                <button
                  onClick={handleSignIn}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-[#817470]/30 hover:bg-[#FAF9F5] bg-white font-medium text-xs text-[#24150F] shadow-sm transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Đăng nhập với Google
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Google Spreadsheet Configuration */}
          <div className="bg-white p-5 rounded-2xl border border-[#E3E2DF] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#974729]">
                Bước 2: Bảng tính Google Sheet nhận dữ liệu
              </span>
              {currentUser && (
                <button
                  onClick={handleCreateNewSheet}
                  disabled={isCreatingSheet}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  {isCreatingSheet ? 'Đang tạo Sheet...' : 'Tạo Sheet Tự Động'}
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                Google Sheet ID (hoặc dán đường link bảng tính Google Sheet của bạn):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sheetIdInput}
                  onChange={(e) => setSheetIdInput(e.target.value)}
                  placeholder="Ví dụ: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#974729]"
                />
                <button
                  onClick={handleSaveSheetId}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#974729] text-white rounded-xl text-xs font-bold hover:bg-[#803a1f] transition-colors"
                >
                  <Save className="w-3.5 h-3.5" /> Lưu
                </button>
              </div>
              <p className="text-[11px] text-[#817470] mt-1.5">
                Mẹo: Bấm nút <strong>"Tạo Sheet Tự Động"</strong> ở trên, hệ thống sẽ tự động tạo sẵn 1 bảng Google Sheet tên <em>"CPAPS - Danh Sách Đơn Nhận Nuôi Chó Mèo"</em> có đầy đủ các cột thông tin chuẩn!
              </p>
            </div>

            {activeSheetId && (
              <div className="pt-2 flex items-center justify-between bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đang kết nối: <strong>Sheet #{activeSheetId.slice(0, 10)}...</strong></span>
                </div>
                <a
                  href={`https://docs.google.com/spreadsheets/d/${activeSheetId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
                >
                  Mở Google Sheet <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Submissions History / Sync tool */}
          <div className="bg-white p-5 rounded-2xl border border-[#E3E2DF] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#974729]">
                  Lịch sử đơn đã tiếp nhận ({localSubmissions.length})
                </h4>
                <p className="text-[11px] text-[#817470]">
                  Tất cả các đơn người dùng gửi sẽ luôn được lưu dự phòng tại đây và gửi tới Google Sheet
                </p>
              </div>

              {localSubmissions.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSyncLocalSubmissions(true)}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-colors shadow-sm cursor-pointer"
                    title="Đẩy toàn bộ các đơn đang có vào Google Sheet"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Đang gửi...' : 'Gửi lại toàn bộ vào Sheet'}
                  </button>
                </div>
              )}
            </div>

            {localSubmissions.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#817470] bg-[#FAF9F5] rounded-xl border border-dashed border-[#E3E2DF]">
                Chưa có đơn nhận nuôi nào được nộp. Khi có người điền form, thông tin sẽ xuất hiện ngay tại đây!
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {localSubmissions.map((sub) => (
                  <div 
                    key={sub.id} 
                    className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E3E2DF] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#24150F] flex items-center gap-1.5">
                        <span>{sub.formData.fullName}</span>
                        <span className="text-[#817470] font-normal">đăng ký nhận bé</span>
                        <span className="text-[#974729] font-semibold">{sub.petName}</span>
                      </div>
                      <div className="text-[11px] text-[#817470]">
                        SĐT: {sub.formData.phone} • {sub.formData.city} • {new Date(sub.createdAt).toLocaleTimeString('vi-VN')} {new Date(sub.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>

                    <div>
                      {sub.syncedToGoogleSheet ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Đã gửi Sheet
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                          Chờ đồng bộ
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#EFEEEA]/60 border-t border-[#E3E2DF] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#24150F] text-white text-xs font-bold hover:bg-black transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
