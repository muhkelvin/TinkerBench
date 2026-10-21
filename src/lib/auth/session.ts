export const SESSION_COOKIE_NAME = 'tb_admin_session';
const DEFAULT_SECRET = 'tinkerbench_admin_secret_key_89f1a23c_sec';

export interface AdminSession {
  email: string;
  role: 'admin';
  exp: number;
}

function base64UrlEncode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str).toString('base64url');
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64url').toString('utf-8');
  }
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return atob(b64);
}

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64url');
  }
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToUint8Array(str: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(str, 'base64url'));
  }
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Creates a signed JWT-like token for admin session.
 */
export async function createSessionToken(email: string): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET || DEFAULT_SECRET;
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days expiration
  const payloadStr = JSON.stringify({ email, role: 'admin', exp });
  const payloadB64 = base64UrlEncode(payloadStr);

  const key = await getHmacKey(secret);
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64));
  const signatureB64 = uint8ArrayToBase64Url(new Uint8Array(signatureBuffer));

  return `${payloadB64}.${signatureB64}`;
}

/**
 * Validates a signed session token. Returns the session payload if valid.
 */
export async function verifySessionToken(token?: string | null): Promise<AdminSession | null> {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return null;
  }

  try {
    const [payloadB64, signatureB64] = token.split('.');
    if (!payloadB64 || !signatureB64) {
      return null;
    }

    const secret = process.env.ADMIN_SESSION_SECRET || DEFAULT_SECRET;
    const key = await getHmacKey(secret);
    const enc = new TextEncoder();
    const signatureBytes = base64UrlToUint8Array(signatureB64);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as any,
      enc.encode(payloadB64)
    );

    if (!isValid) {
      return null;
    }

    const payloadStr = base64UrlDecode(payloadB64);
    const data = JSON.parse(payloadStr) as AdminSession;

    // Check expiration
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    if (data.role !== 'admin') {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}
