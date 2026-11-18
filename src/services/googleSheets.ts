import { Pet } from '../types';
import { getCachedAccessToken } from './auth';

export interface AdoptionFormData {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  housingType: string;
  hasWindowScreens: string;
  experience: string;
  monthlyBudget: string;
  commitSpayAndCare: boolean;
  allowHomeVisit: boolean;
  message: string;
}

export interface StoredAdoptionSubmission {
  id: string;
  createdAt: string;
  petId: string;
  petName: string;
  petBreed: string;
  formData: AdoptionFormData;
  syncedToGoogleSheet?: boolean;
}

export const DEFAULT_SPREADSHEET_ID = '1YcGdwS2foBQBXAcQ3VPFKfdobG9E61UGFvX5l5uL6bk';
const LOCAL_STORAGE_KEY = 'cpaps_adoption_submissions_v1';
const GOOGLE_SHEET_ID_KEY = 'cpaps_google_sheet_id_v1';

export const getSavedSpreadsheetId = (): string => {
  return localStorage.getItem(GOOGLE_SHEET_ID_KEY) || DEFAULT_SPREADSHEET_ID;
};

export const saveSpreadsheetId = (sheetId: string) => {
  localStorage.setItem(GOOGLE_SHEET_ID_KEY, sheetId.trim() || DEFAULT_SPREADSHEET_ID);
};

export const getLocalAdoptions = (): StoredAdoptionSubmission[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse local adoptions', e);
    return [];
  }
};

export const saveLocalAdoption = (submission: StoredAdoptionSubmission) => {
  try {
    const list = getLocalAdoptions();
    list.unshift(submission);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save adoption locally', e);
  }
};

export const markSubmissionSynced = (id: string) => {
  try {
    const list = getLocalAdoptions();
    const updated = list.map(item => item.id === id ? { ...item, syncedToGoogleSheet: true } : item);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
};

/**
 * Creates a brand new Google Spreadsheet for CPAPS Adoption Requests
 */
export const createAdoptionSpreadsheet = async (accessToken: string): Promise<string> => {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: 'CPAPS - Danh Sách Đơn Nhận Nuôi Chó Mèo',
      },
      sheets: [
        {
          properties: {
            title: 'Đơn Nhận Nuôi',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Không thể tạo Google Sheet');
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;

  // Add header row
  const headers = [
    'Thời gian nộp',
    'Mã bé',
    'Tên bé',
    'Giống / Loài',
    'Họ tên người nhận',
    'Số điện thoại (Zalo)',
    'Email',
    'Tỉnh / Thành phố',
    'Địa chỉ chi tiết',
    'Loại nhà ở',
    'Lưới an toàn / Cửa rào',
    'Kinh nghiệm nuôi',
    'Lời nhắn gửi',
    'Cam kết thiến & chăm sóc',
    'Đồng ý liên hệ thăm hỏi'
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Đơn Nhận Nuôi'!A1:O1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [headers],
    }),
  });

  saveSpreadsheetId(spreadsheetId);
  return spreadsheetId;
};

/**
 * Appends an adoption row to Google Sheet
 * Maps perfectly to user's columns:
 * A: THỜI GIAN
 * B: NHẬN NUÔI (Tên bé)
 * C: SỐ HIỆU (Mã bé)
 * D: CHÓ/MÈO (Loài)
 * E: TÊN NGƯỜI ĐĂNG KÝ
 * F: SDT
 * G: EMAIL
 * H: ĐỊA ĐIỂM (Tỉnh / Thành phố)
 * I: SỐ NHÀ (Địa chỉ chi tiết + Loại nhà)
 * J: AN TOÀN (Lưới chắn / Rào chắn)
 * K: KINH NGHIỆM
 * L: CAM KẾT
 * M: ĐỒNG Ý (Đồng ý thăm hỏi)
 * N: LỜI NHẮN
 */
export const appendAdoptionToSheet = async (
  spreadsheetId: string,
  pet: Pet,
  formData: AdoptionFormData,
  accessToken?: string
) => {
  const token = accessToken || getCachedAccessToken();
  if (!token) {
    throw new Error('Chưa đăng nhập Google hoặc phiên làm việc đã hết hạn');
  }

  // Row matching the user's table columns:
  const row = [
    new Date().toLocaleString('vi-VN'),                        // A: THỜI GIAN
    pet.name,                                                  // B: NHẬN NUÔI
    pet.id,                                                    // C: SỐ HIỆU
    pet.species === 'cat' ? 'Mèo' : 'Chó',                     // D: CHÓ/MÈO
    formData.fullName,                                         // E: TÊN NGƯỜI ĐĂNG KÝ
    formData.phone,                                            // F: SDT
    formData.email || '',                                      // G: EMAIL
    formData.city,                                             // H: ĐỊA ĐIỂM
    `${formData.address} (${formData.housingType})`,           // I: SỐ NHÀ
    formData.hasWindowScreens,                                 // J: AN TOÀN
    formData.experience,                                       // K: KINH NGHIỆM
    formData.commitSpayAndCare ? 'Cam kết thiến & chăm sóc' : 'Chưa cam kết', // L: CAM KẾT
    formData.allowHomeVisit ? 'Đồng ý thăm hỏi' : 'Không đồng ý',            // M: ĐỒNG Ý
    formData.message || '',                                    // N: LỜI NHẮN
  ];

  // 1. Discover all sheets and pick the active visible sheet tab
  let targetSheetName = '';
  try {
    const metaRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title,hidden))`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (metaRes.ok) {
      const metaData = await metaRes.json();
      const visibleSheets = (metaData.sheets || []).filter((s: any) => !s?.properties?.hidden);
      if (visibleSheets.length > 0) {
        // Use the first visible sheet title (e.g. 'Trang tính1', 'Sheet1', or whatever the tab is named)
        targetSheetName = visibleSheets[0]?.properties?.title || '';
      }
    }
  } catch (e) {
    console.warn('Could not inspect sheet tabs, proceeding with default range');
  }

  const sheetPrefix = targetSheetName ? `'${targetSheetName}'!` : '';

  // 2. Scan Column A to find next empty row index
  let nextRowIndex = 4; // User's header is merged A1:A3, so data starts at row 4
  try {
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${sheetPrefix}A:A`)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (checkRes.ok) {
      const checkData = await checkRes.json();
      const existingRows = checkData.values || [];
      // If there are rows, next row is existing length + 1, but at least row 4
      nextRowIndex = Math.max(existingRows.length + 1, 4);
    }
  } catch (e) {
    console.warn('Could not fetch existing row index');
  }

  // 3. Write directly into exact range A{nextRowIndex}:N{nextRowIndex}
  const directRange = encodeURIComponent(`${sheetPrefix}A${nextRowIndex}:N${nextRowIndex}`);
  const writeRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${directRange}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [row],
      }),
    }
  );

  if (writeRes.ok) {
    return await writeRes.json();
  }

  // 4. Fallback: bounded append
  const appendRange = encodeURIComponent(`${sheetPrefix}A:N`);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${appendRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [row],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Không thể ghi dữ liệu vào Google Sheet');
  }

  return await response.json();
};
