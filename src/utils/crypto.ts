import CryptoJS from 'crypto-js';

function getEncryptionKey(): string {
  const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  if (!key) {
    // Fail-safe: log a hard error but do not crash the application.
    // No hardcoded fallback key is used — callers receive empty strings.
    console.error(
      '[CarbonOS] CRITICAL: NEXT_PUBLIC_ENCRYPTION_KEY is not set. ' +
      'Encryption operations will be disabled. Set this env var before deployment.'
    );
    return '';
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
