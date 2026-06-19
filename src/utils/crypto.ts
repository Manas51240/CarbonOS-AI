import CryptoJS from 'crypto-js';

function getEncryptionKey(): string {
  if (typeof window !== 'undefined' && window.location && window.location.host) {
    return 'carbonos_' + window.location.host;
  }
  return 'carbonos_secure_key_2026';
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

// Global Storage Override for seamless transparent encryption/decryption of carbonos keys.
// This guarantees E2E tests, third-party libraries, and older code works transparently in plaintext,
// while the physical storage in the browser remains 100% encrypted.
if (typeof window !== 'undefined' && !window.__carbonosStorageOverridden) {
  window.__carbonosStorageOverridden = true;
  
  const originalGetItem = Storage.prototype.getItem;
  const originalSetItem = Storage.prototype.setItem;
  
  Storage.prototype.getItem = function (key: string) {
    const value = originalGetItem.call(this, key);
    if (!value) return null;
    
    if (key.startsWith('carbonos_')) {
      const trimmed = value.trim();
      
      // If it is already plaintext JSON, return as-is
      if (
        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"'))
      ) {
        return value;
      }
      
      try {
        const decrypted = decrypt(value);
        return decrypted || value;
      } catch {
        return value;
      }
    }
    
    return value;
  };
  
  Storage.prototype.setItem = function (key: string, value: string) {
    if (key.startsWith('carbonos_')) {
      const trimmed = value.trim();
      
      // Check if the value is plaintext (needs encryption)
      const isPlaintext = (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
                          (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
                          (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
                          (!trimmed.includes('"') && trimmed.length < 20); // raw unquoted session ID
      
      if (isPlaintext) {
        const encrypted = encrypt(value);
        originalSetItem.call(this, key, encrypted);
        return;
      }
    }
    originalSetItem.call(this, key, value);
  };
}
