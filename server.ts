import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface FirebaseAppletConfig {
  projectId: string;
  apiKey: string;
  firestoreDatabaseId?: string;
}

function loadFirebaseConfig(): FirebaseAppletConfig {
  const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
  const raw = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(raw) as FirebaseAppletConfig;
}

const firebaseConfig = loadFirebaseConfig();
const FIREBASE_PROJECT_ID = firebaseConfig.projectId;
const FIREBASE_API_KEY = firebaseConfig.apiKey;
const FIRESTORE_DATABASE_ID = firebaseConfig.firestoreDatabaseId || '(default)';
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/${FIRESTORE_DATABASE_ID}/documents`;

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// List of allowed admin emails (defaults to app owner email)
const ALLOWED_ADMINS = (process.env.ADMIN_EMAILS || 'ausinon@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// N8N Webhook configuration (stored securely server-side)
const N8N_WEBHOOK_URL =
  process.env.N8N_MARKETING_WEBHOOK_URL ||
  'https://huong11.app.n8n.cloud/webhook/marketing-agent';
const N8N_AUTH_TOKEN = process.env.N8N_WEBHOOK_AUTH_TOKEN || '';

// Cache for Google public x509 certs used to verify Firebase ID tokens
let cachedCerts: Record<string, string> = {};
let certsExpireAt = 0;

async function getFirebasePublicCerts(): Promise<Record<string, string>> {
  const now = Date.now();
  if (now < certsExpireAt && Object.keys(cachedCerts).length > 0) {
    return cachedCerts;
  }

  const resp = await fetch(
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
  );
  if (!resp.ok) {
    throw new Error(`Không thể tải chứng chỉ xác thực Firebase (${resp.status}).`);
  }

  const certs = (await resp.json()) as Record<string, string>;
  const cacheControl = resp.headers.get('cache-control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
  const maxAgeSec = maxAgeMatch ? Number(maxAgeMatch[1]) : 3600;

  cachedCerts = certs;
  certsExpireAt = now + maxAgeSec * 1000;
  return certs;
}

function decodeBase64Url(str: string): Buffer {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
  return Buffer.from(padded, 'base64');
}

interface VerifiedFirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  idToken: string;
}

class AuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function verifyFirebaseIdToken(idToken: string): Promise<VerifiedFirebaseUser> {
  if (!idToken || typeof idToken !== 'string') {
    throw new AuthError(401, 'Thiếu Firebase ID token xác thực.');
  }

  const parts = idToken.split('.');
  if (parts.length !== 3) {
    throw new AuthError(401, 'Firebase ID token không hợp lệ.');
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  let header: { alg?: string; kid?: string };
  let payload: {
    aud?: string;
    iss?: string;
    sub?: string;
    exp?: number;
    iat?: number;
    email?: string;
    email_verified?: boolean;
  };

  try {
    header = JSON.parse(decodeBase64Url(headerB64).toString('utf8'));
    payload = JSON.parse(decodeBase64Url(payloadB64).toString('utf8'));
  } catch {
    throw new AuthError(401, 'Không thể giải mã Firebase ID token.');
  }

  if (header.alg !== 'RS256' || !header.kid) {
    throw new AuthError(401, 'Thuật toán hoặc key ID của token không hợp lệ.');
  }

  const certs = await getFirebasePublicCerts();
  let pemCert = certs[header.kid];
  if (!pemCert) {
    // Force refresh certs once in case Google rotated keys
    certsExpireAt = 0;
    const refreshed = await getFirebasePublicCerts();
    pemCert = refreshed[header.kid];
  }
  if (!pemCert) {
    throw new AuthError(401, 'Không tìm thấy khóa công khai phù hợp cho token.');
  }

  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${headerB64}.${payloadB64}`);
  verifier.end();

  const signatureValid = verifier.verify(pemCert, decodeBase64Url(signatureB64));
  if (!signatureValid) {
    throw new AuthError(401, 'Chữ ký Firebase ID token không hợp lệ.');
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (payload.aud !== FIREBASE_PROJECT_ID) {
    throw new AuthError(401, 'Token không thuộc dự án Firebase hiện tại.');
  }
  if (payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) {
    throw new AuthError(401, 'Issuer của Firebase ID token không hợp lệ.');
  }
  if (!payload.sub || typeof payload.sub !== 'string') {
    throw new AuthError(401, 'Token thiếu thông tin người dùng (sub).');
  }
  if (!payload.exp || payload.exp <= nowSec) {
    throw new AuthError(401, 'Phiên đăng nhập Firebase đã hết hạn. Vui lòng đăng nhập lại.');
  }
  if (payload.iat && payload.iat > nowSec + 300) {
    throw new AuthError(401, 'Thời gian phát hành token không hợp lệ.');
  }

  // Cross-check with Firebase Identity Toolkit to confirm account is active & not revoked
  const lookupResp = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!lookupResp.ok) {
    throw new AuthError(401, 'Firebase ID token đã bị thu hồi hoặc không hợp lệ.');
  }

  const lookupData = (await lookupResp.json()) as {
    users?: Array<{
      localId?: string;
      email?: string;
      emailVerified?: boolean;
      disabled?: boolean;
    }>;
  };
  const account = lookupData.users?.[0];
  if (!account || account.disabled) {
    throw new AuthError(401, 'Tài khoản người dùng không tồn tại hoặc đã bị vô hiệu hóa.');
  }

  const email = (account.email || payload.email || '').trim().toLowerCase();
  const emailVerified = Boolean(account.emailVerified ?? payload.email_verified);
  const uid = account.localId || payload.sub;

  if (!email) {
    throw new AuthError(403, 'Tài khoản không có email hợp lệ.');
  }
  if (!emailVerified) {
    throw new AuthError(403, 'Email tài khoản chưa được xác minh.');
  }

  return { uid, email, emailVerified, idToken };
}

async function requireVerifiedAdmin(req: Request): Promise<VerifiedFirebaseUser> {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match || !match[1]) {
    throw new AuthError(401, 'Yêu cầu xác thực quản trị viên (thiếu Bearer Firebase ID token).');
  }

  const user = await verifyFirebaseIdToken(match[1].trim());
  if (!ALLOWED_ADMINS.includes(user.email)) {
    throw new AuthError(
      403,
      `Email ${user.email} không nằm trong danh sách quản trị viên được phép thực hiện thao tác này.`
    );
  }
  return user;
}

// Firestore REST value helpers
type FirestoreValue =
  | { stringValue: string }
  | { timestampValue: string }
  | { booleanValue: boolean }
  | { integerValue: string };

interface FirestoreDocument {
  name: string;
  fields?: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
}

function getStringField(fields: Record<string, any> | undefined, key: string): string | undefined {
  const val = fields?.[key];
  if (!val) return undefined;
  if (typeof val.stringValue === 'string' && val.stringValue.trim().length > 0) {
    return val.stringValue;
  }
  return undefined;
}

function getTimestampField(fields: Record<string, any> | undefined, key: string): string | undefined {
  const val = fields?.[key];
  if (!val) return undefined;
  if (typeof val.timestampValue === 'string') {
    return val.timestampValue;
  }
  return undefined;
}

function mapFirestoreDocToStory(doc: FirestoreDocument) {
  const fields = doc.fields || {};
  const id = doc.name.split('/').pop() || '';
  const story: Record<string, any> = {
    id,
    title: getStringField(fields, 'title') || '',
    fullStory: getStringField(fields, 'fullStory') || '',
    status: getStringField(fields, 'status') || 'published',
  };

  const optionalStringKeys = [
    'summary',
    'petName',
    'species',
    'adopterName',
    'adoptDate',
    'beforeImage',
    'afterImage',
    'quote',
    'source',
    'draftId',
  ];

  for (const key of optionalStringKeys) {
    const val = getStringField(fields, key);
    if (val !== undefined) {
      story[key] = val;
    }
  }

  const createdAt = getTimestampField(fields, 'createdAt') || doc.createTime;
  const publishedAt = getTimestampField(fields, 'publishedAt');
  if (createdAt) story.createdAt = createdAt;
  if (publishedAt) story.publishedAt = publishedAt;

  return story;
}

function cleanOptionalString(val: unknown, maxLen: number): string | undefined {
  if (typeof val !== 'string') return undefined;
  const trimmed = val.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLen);
}

async function fetchStoryById(storyId: string, bearerToken?: string) {
  const url = bearerToken
    ? `${FIRESTORE_BASE_URL}/stories/${encodeURIComponent(storyId)}`
    : `${FIRESTORE_BASE_URL}/stories/${encodeURIComponent(storyId)}?key=${FIREBASE_API_KEY}`;

  const headers: Record<string, string> = {};
  if (bearerToken) {
    headers['Authorization'] = `Bearer ${bearerToken}`;
  }

  const resp = await fetch(url, { headers });
  if (resp.status === 404) return null;
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Không thể đọc bài viết từ Firestore (${resp.status}): ${text.slice(0, 200)}`);
  }

  const doc = (await resp.json()) as FirestoreDocument;
  return mapFirestoreDocToStory(doc);
}

// In-memory lock to deduplicate simultaneous double-clicks for the same draftId
const inFlightDraftPublishes = new Map<string, Promise<{ story: Record<string, any>; alreadyExisted: boolean }>>();

/**
 * Verification route for admin permissions and status check
 */
app.get('/api/marketing/status', (req, res) => {
  const userEmail = ((req.headers['x-admin-email'] as string) || '').trim().toLowerCase();
  const isAdmin = !!userEmail && ALLOWED_ADMINS.includes(userEmail);

  res.json({
    configured: !!N8N_WEBHOOK_URL,
    requiresAuthHeader: !!N8N_AUTH_TOKEN,
    isAdmin,
    allowedAdminsCount: ALLOWED_ADMINS.length,
  });
});

/**
 * Secure Backend Proxy for n8n AI Marketing Agent
 * Verifies Firebase ID token when provided (and checks ADMIN_EMAILS).
 */
app.post('/api/marketing/chat', async (req: Request, res: Response) => {
  try {
    let requesterEmail = '';
    try {
      const verified = await requireVerifiedAdmin(req);
      requesterEmail = verified.email;
    } catch (authErr) {
      if (authErr instanceof AuthError) {
        return res.status(authErr.status).json({ error: authErr.message });
      }
      throw authErr;
    }

    const { message, context } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        error: 'Nội dung yêu cầu không được để trống.',
      });
    }

    if (!N8N_WEBHOOK_URL) {
      return res.status(500).json({
        error: 'Chưa cấu hình URL webhook n8n trên máy chủ.',
      });
    }

    // Set up AbortController with 60s timeout for n8n + Gemini agent execution
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'CPAPS-Applet-Backend/1.0',
    };

    if (N8N_AUTH_TOKEN) {
      headers['Authorization'] = `Bearer ${N8N_AUTH_TOKEN}`;
      headers['X-API-KEY'] = N8N_AUTH_TOKEN;
    }

    let n8nResponse: globalThis.Response;
    try {
      n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: message.trim(),
          context: context || 'CPAPS Pet Rescue & Adoption Vietnam',
          requester: requesterEmail,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        return res.status(504).json({
          error: 'Yêu cầu tới AI Marketing Agent bị quá thời gian (timeout sau 60 giây). Vui lòng thử lại với yêu cầu ngắn gọn hơn.',
        });
      }
      return res.status(502).json({
        error: `Không thể kết nối đến webhook n8n: ${fetchErr.message || 'Lỗi mạng'}`,
      });
    }

    clearTimeout(timeoutId);

    if (!n8nResponse.ok) {
      const errText = await n8nResponse.text();
      return res.status(n8nResponse.status).json({
        error: `Máy chủ n8n trả về mã lỗi ${n8nResponse.status}: ${errText.slice(0, 200)}`,
      });
    }

    const rawBody = await n8nResponse.text();
    let data: any;
    try {
      data = JSON.parse(rawBody);
    } catch {
      data = { output: rawBody };
    }

    // n8n returns object with "output", or an array of items [{ output: ... }], or { text: ... }
    let outputText = '';
    if (typeof data === 'string') {
      outputText = data;
    } else if (data?.output) {
      outputText = typeof data.output === 'string' ? data.output : JSON.stringify(data.output, null, 2);
    } else if (Array.isArray(data) && data[0]?.output) {
      outputText = typeof data[0].output === 'string' ? data[0].output : JSON.stringify(data[0].output, null, 2);
    } else if (data?.text || data?.message || data?.response) {
      outputText = data.text || data.message || data.response;
    } else {
      outputText = JSON.stringify(data, null, 2);
    }

    return res.json({
      output: outputText,
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('API Error in /api/marketing/chat:', error);
    return res.status(500).json({
      error: `Đã xảy ra lỗi máy chủ nội bộ: ${error.message || 'Không xác định'}`,
    });
  }
});

/**
 * GET /api/stories
 * Public endpoint returning published stories from Firestore, newest first.
 */
app.get('/api/stories', async (_req: Request, res: Response) => {
  try {
    const queryResp = await fetch(`${FIRESTORE_BASE_URL}:runQuery?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'stories' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'status' },
              op: 'EQUAL',
              value: { stringValue: 'published' },
            },
          },
        },
      }),
    });

    if (!queryResp.ok) {
      const errText = await queryResp.text();
      console.error('Firestore query error in GET /api/stories:', queryResp.status, errText);
      return res.status(502).json({
        error: 'Không thể tải danh sách bài viết từ Cloud Firestore. Vui lòng thử lại sau.',
      });
    }

    const rows = (await queryResp.json()) as Array<{ document?: FirestoreDocument }>;
    const stories = rows
      .filter((row): row is { document: FirestoreDocument } => Boolean(row.document))
      .map((row) => mapFirestoreDocToStory(row.document))
      .sort((a, b) => {
        const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });

    return res.json({
      stories,
      success: true,
    });
  } catch (error: any) {
    console.error('API Error in GET /api/stories:', error);
    return res.status(500).json({
      error: 'Đã xảy ra lỗi khi tải bài viết Góc yêu thương.',
    });
  }
});

/**
 * POST /api/stories
 * Admin-only endpoint to publish a story to Cloud Firestore with draftId idempotency.
 */
app.post('/api/stories', async (req: Request, res: Response) => {
  let adminUser: VerifiedFirebaseUser;
  try {
    adminUser = await requireVerifiedAdmin(req);
  } catch (authErr: any) {
    if (authErr instanceof AuthError) {
      return res.status(authErr.status).json({ error: authErr.message });
    }
    return res.status(401).json({ error: 'Không thể xác thực quản trị viên.' });
  }

  try {
    const body = req.body || {};
    const title = cleanOptionalString(body.title, 200);
    const fullStory = cleanOptionalString(body.fullStory, 20000);

    if (!title) {
      return res.status(400).json({ error: 'Tiêu đề bài viết không được để trống.' });
    }
    if (!fullStory) {
      return res.status(400).json({ error: 'Nội dung bài viết không được để trống.' });
    }

    const summary = cleanOptionalString(body.summary, 500);
    const petName = cleanOptionalString(body.petName, 100);
    const species = body.species === 'dog' || body.species === 'cat' ? body.species : undefined;
    const adopterName = cleanOptionalString(body.adopterName, 120);
    const adoptDate = cleanOptionalString(body.adoptDate, 50);
    const beforeImage = cleanOptionalString(body.beforeImage, 1000);
    const afterImage = cleanOptionalString(body.afterImage, 1000);
    const quote = cleanOptionalString(body.quote, 500);
    const draftId = cleanOptionalString(body.draftId, 128);
    const source =
      body.source === 'n8n_ai_marketing' || body.source === 'admin'
        ? body.source
        : 'n8n_ai_marketing';

    // Deterministic doc ID derived from draftId guarantees idempotency across retries/double-clicks
    const storyId = draftId
      ? `draft_${crypto.createHash('sha256').update(draftId).digest('hex').slice(0, 24)}`
      : `story_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    const executePublish = async (): Promise<{ story: Record<string, any>; alreadyExisted: boolean }> => {
      // 1. Check if already published for this draftId
      const existing = await fetchStoryById(storyId, adminUser.idToken);
      if (existing) {
        return { story: existing, alreadyExisted: true };
      }

      // 2. Build strict Firestore fields payload (only include provided optional fields)
      const fields: Record<string, FirestoreValue> = {
        title: { stringValue: title },
        fullStory: { stringValue: fullStory },
        status: { stringValue: 'published' },
        source: { stringValue: source },
        authorUid: { stringValue: adminUser.uid },
      };

      if (draftId) fields.draftId = { stringValue: draftId };
      if (summary) fields.summary = { stringValue: summary };
      if (petName) fields.petName = { stringValue: petName };
      if (species) fields.species = { stringValue: species };
      if (adopterName) fields.adopterName = { stringValue: adopterName };
      if (adoptDate) fields.adoptDate = { stringValue: adoptDate };
      if (beforeImage) fields.beforeImage = { stringValue: beforeImage };
      if (afterImage) fields.afterImage = { stringValue: afterImage };
      if (quote) fields.quote = { stringValue: quote };

      const docName = `projects/${FIREBASE_PROJECT_ID}/databases/${FIRESTORE_DATABASE_ID}/documents/stories/${storyId}`;
      const commitResp = await fetch(`${FIRESTORE_BASE_URL}:commit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminUser.idToken}`,
        },
        body: JSON.stringify({
          writes: [
            {
              update: {
                name: docName,
                fields,
              },
              updateTransforms: [
                { fieldPath: 'createdAt', setToServerValue: 'REQUEST_TIME' },
                { fieldPath: 'publishedAt', setToServerValue: 'REQUEST_TIME' },
              ],
              currentDocument: { exists: false },
            },
          ],
        }),
      });

      if (!commitResp.ok) {
        const errBody = await commitResp.text();
        // Concurrent double-click race: document was just created by parallel request
        if (
          commitResp.status === 409 ||
          errBody.includes('ALREADY_EXISTS') ||
          errBody.includes('FAILED_PRECONDITION')
        ) {
          const raceExisting = await fetchStoryById(storyId, adminUser.idToken);
          if (raceExisting) {
            return { story: raceExisting, alreadyExisted: true };
          }
        }
        throw new Error(`Firestore từ chối lưu bài (${commitResp.status}): ${errBody.slice(0, 300)}`);
      }

      const savedStory = await fetchStoryById(storyId, adminUser.idToken);
      if (!savedStory) {
        throw new Error('Đã lưu bài viết nhưng không đọc lại được từ Firestore.');
      }
      return { story: savedStory, alreadyExisted: false };
    };

    let pendingPromise = inFlightDraftPublishes.get(storyId);
    if (!pendingPromise) {
      pendingPromise = executePublish().finally(() => {
        inFlightDraftPublishes.delete(storyId);
      });
      inFlightDraftPublishes.set(storyId, pendingPromise);
    }

    const result = await pendingPromise;
    return res.status(result.alreadyExisted ? 200 : 201).json({
      success: true,
      alreadyExisted: result.alreadyExisted,
      story: result.story,
    });
  } catch (error: any) {
    console.error('API Error in POST /api/stories:', error);
    return res.status(500).json({
      error: error.message || 'Không thể đăng bài viết lên Cloud Firestore.',
    });
  }
});

/**
 * POST /api/stories/submit
 * Public endpoint for community story submissions. Always saved with status='pending' for admin review.
 */
app.post('/api/stories/submit', async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const title = cleanOptionalString(body.title, 200);
    const fullStory = cleanOptionalString(body.fullStory, 20000);

    if (!title) {
      return res.status(400).json({ error: 'Vui lòng nhập tiêu đề câu chuyện.' });
    }
    if (!fullStory) {
      return res.status(400).json({ error: 'Vui lòng nhập nội dung câu chuyện.' });
    }

    const summary = cleanOptionalString(body.summary, 500);
    const petName = cleanOptionalString(body.petName, 100);
    const species = body.species === 'dog' || body.species === 'cat' ? body.species : undefined;
    const adopterName = cleanOptionalString(body.adopterName, 120);
    const adoptDate = cleanOptionalString(body.adoptDate, 50);
    const beforeImage = cleanOptionalString(body.beforeImage, 1000);
    const afterImage = cleanOptionalString(body.afterImage, 1000);
    const quote = cleanOptionalString(body.quote, 500);

    const storyId = `pending_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const fields: Record<string, FirestoreValue> = {
      title: { stringValue: title },
      fullStory: { stringValue: fullStory },
      status: { stringValue: 'pending' },
      source: { stringValue: 'community_submission' },
    };

    if (summary) fields.summary = { stringValue: summary };
    if (petName) fields.petName = { stringValue: petName };
    if (species) fields.species = { stringValue: species };
    if (adopterName) fields.adopterName = { stringValue: adopterName };
    if (adoptDate) fields.adoptDate = { stringValue: adoptDate };
    if (beforeImage) fields.beforeImage = { stringValue: beforeImage };
    if (afterImage) fields.afterImage = { stringValue: afterImage };
    if (quote) fields.quote = { stringValue: quote };

    const docName = `projects/${FIREBASE_PROJECT_ID}/databases/${FIRESTORE_DATABASE_ID}/documents/stories/${storyId}`;
    const commitResp = await fetch(`${FIRESTORE_BASE_URL}:commit?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        writes: [
          {
            update: {
              name: docName,
              fields,
            },
            updateTransforms: [
              { fieldPath: 'createdAt', setToServerValue: 'REQUEST_TIME' },
            ],
            currentDocument: { exists: false },
          },
        ],
      }),
    });

    if (!commitResp.ok) {
      const errBody = await commitResp.text();
      console.error('Firestore error in POST /api/stories/submit:', commitResp.status, errBody);
      return res.status(502).json({
        error: 'Không thể gửi câu chuyện lên hệ thống lúc này. Vui lòng thử lại sau.',
      });
    }

    return res.status(201).json({
      success: true,
      id: storyId,
      status: 'pending',
      message: 'Đã gửi câu chuyện để xét duyệt',
    });
  } catch (error: any) {
    console.error('API Error in POST /api/stories/submit:', error);
    return res.status(500).json({
      error: 'Đã xảy ra lỗi máy chủ khi gửi câu chuyện.',
    });
  }
});

// Vite Middleware for development, or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
