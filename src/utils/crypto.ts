import CryptoJS from 'crypto-js';

function getEncryptionKey(): string {
  return 'carbonos_secure_aes_key_2026_@#$!_prod_salting';
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


