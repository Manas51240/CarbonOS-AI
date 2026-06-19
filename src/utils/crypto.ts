import CryptoJS from 'crypto-js';

function getEncryptionKey(): string {
  const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  if (!key) {
    throw new Error(
      '[CarbonOS] NEXT_PUBLIC_ENCRYPTION_KEY is not set. ' +
      'Set this environment variable before running the application.'
    );
  }
  return key;
}


export function encrypt(text: string): string {
  if (!text) return '';
  try {
    return CryptoJS.AES.encrypt(text, getEncryptionKey()).toString();
  } catch (e) {
    console.error('[CarbonOS] Encryption error:', e);
    return '';
  }
}

export function decrypt(cipherText: string): string {
  if (!cipherText) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, getEncryptionKey());
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error('[CarbonOS] Decryption error:', e);
    return '';
  }
}
