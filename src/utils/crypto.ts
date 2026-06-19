import CryptoJS from 'crypto-js';

function getEncryptionKey(): string {
  return process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'carbonos_fallback_secure_key';
}


export function encrypt(text: string): string {
  if (!text) return '';
  try {
    return CryptoJS.AES.encrypt(text, getEncryptionKey()).toString();
  } catch (e) {
    console.error('Encryption failed:', e);
    return '';
  }
}

export function decrypt(cipherText: string): string {
  if (!cipherText) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, getEncryptionKey());
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return '';
  }
}


