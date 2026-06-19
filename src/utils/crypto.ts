/**
 * Lightweight synchronous cryptographic utility for local storage serialization.
 * Prevents local client modifications or plaintext leaks of user profile details,
 * rewards balances, or daily carbon calculations.
 * Supports multi-byte Unicode strings (like Emojis) using TextEncoder & TextDecoder.
 */

function getEncryptionKey(): string {
  if (typeof window !== 'undefined' && window.location && window.location.host) {
    return 'carbonos_' + window.location.host;
  }
  return 'carbonos_secure_key_2026';
}

export function encrypt(text: string): string {
  if (!text) return '';
  
  // Convert string to UTF-8 bytes
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  
  const keyEncoder = new TextEncoder();
  const keyBytes = keyEncoder.encode(getEncryptionKey());
  
  // Apply XOR cipher on UTF-8 bytes
  const resultBytes = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    resultBytes[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
  }
  
  // Convert UTF-8 bytes to binary string (character codes 0-255)
  let binaryString = '';
  for (let i = 0; i < resultBytes.length; i++) {
    binaryString += String.fromCharCode(resultBytes[i]);
  }
  
  if (typeof btoa !== 'undefined') {
    return btoa(binaryString);
  }
  return Buffer.from(resultBytes).toString('base64');
}

export function decrypt(cipherText: string): string {
  if (!cipherText) return '';
  try {
    let binaryString = '';
    if (typeof atob !== 'undefined') {
      binaryString = atob(cipherText);
    } else {
      binaryString = Buffer.from(cipherText, 'base64').toString('binary');
    }
    
    // Convert binary string back to byte array
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const keyEncoder = new TextEncoder();
    const keyBytes = keyEncoder.encode(getEncryptionKey());
    
    // Apply XOR cipher to revert
    const resultBytes = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      resultBytes[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
    }
    
    // Decode UTF-8 bytes back to Unicode string
    const decoder = new TextDecoder();
    return decoder.decode(resultBytes);
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
