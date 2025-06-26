/**
 * Enhanced storage utilities with TypeScript support
 */
export class StorageUtils {
  private static readonly PREFIX = 'webtimewise_';
  private static readonly ENCRYPTION_KEY = 'wtw_secure_key_2025';

  /**
   * Set item in localStorage with optional encryption
   */
  static setItem<T>(key: string, value: T, encrypt: boolean = false): void {
    try {
      const serializedValue = JSON.stringify(value);
      const finalValue = encrypt ? this.encrypt(serializedValue) : serializedValue;
      localStorage.setItem(this.PREFIX + key, finalValue);
    } catch (error) {
      console.error('Failed to set localStorage item:', error);
      throw new Error(`Failed to store ${key}`);
    }
  }

  /**
   * Get item from localStorage with optional decryption
   */
  static getItem<T>(key: string, defaultValue?: T, encrypted: boolean = false): T | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      if (item === null) {
        return defaultValue || null;
      }

      const decryptedItem = encrypted ? this.decrypt(item) : item;
      return JSON.parse(decryptedItem);
    } catch (error) {
      console.error('Failed to get localStorage item:', error);
      return defaultValue || null;
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(this.PREFIX + key);
    } catch (error) {
      console.error('Failed to remove localStorage item:', error);
    }
  }

  /**
   * Clear all app-related items from localStorage
   */
  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  /**
   * Get all app-related keys
   */
  static getKeys(): string[] {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.PREFIX))
        .map(key => key.replace(this.PREFIX, ''));
    } catch (error) {
      console.error('Failed to get localStorage keys:', error);
      return [];
    }
  }

  /**
   * Check if key exists
   */
  static hasItem(key: string): boolean {
    try {
      return localStorage.getItem(this.PREFIX + key) !== null;
    } catch (error) {
      console.error('Failed to check localStorage item:', error);
      return false;
    }
  }

  /**
   * Get storage size in bytes
   */
  static getStorageSize(): number {
    try {
      let total = 0;
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          const value = localStorage.getItem(key) || '';
          total += key.length + value.length;
        }
      });
      
      return total;
    } catch (error) {
      console.error('Failed to calculate storage size:', error);
      return 0;
    }
  }

  /**
   * Get storage size in human readable format
   */
  static getStorageSizeFormatted(): string {
    const bytes = this.getStorageSize();
    
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  }

  /**
   * Export all data
   */
  static exportData(): string {
    try {
      const data: Record<string, any> = {};
      const keys = this.getKeys();
      
      keys.forEach(key => {
        data[key] = this.getItem(key);
      });
      
      return JSON.stringify({
        version: '2.0',
        timestamp: Date.now(),
        data
      }, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('Failed to export data');
    }
  }

  /**
   * Import data
   */
  static importData(jsonData: string): void {
    try {
      const parsed = JSON.parse(jsonData);
      
      if (!parsed.data || typeof parsed.data !== 'object') {
        throw new Error('Invalid data format');
      }
      
      // Clear existing data
      this.clear();
      
      // Import new data
      Object.entries(parsed.data).forEach(([key, value]) => {
        this.setItem(key, value);
      });
      
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Failed to import data');
    }
  }

  /**
   * Set item with expiration
   */
  static setItemWithExpiry<T>(key: string, value: T, expiryMs: number): void {
    const item = {
      value,
      expiry: Date.now() + expiryMs
    };
    this.setItem(key, item);
  }

  /**
   * Get item with expiration check
   */
  static getItemWithExpiry<T>(key: string, defaultValue?: T): T | null {
    const item = this.getItem<{ value: T; expiry: number }>(key);
    
    if (!item) {
      return defaultValue || null;
    }
    
    if (Date.now() > item.expiry) {
      this.removeItem(key);
      return defaultValue || null;
    }
    
    return item.value;
  }

  /**
   * Batch set multiple items
   */
  static setItems(items: Record<string, any>): void {
    try {
      Object.entries(items).forEach(([key, value]) => {
        this.setItem(key, value);
      });
    } catch (error) {
      console.error('Failed to set multiple items:', error);
      throw new Error('Failed to store multiple items');
    }
  }

  /**
   * Batch get multiple items
   */
  static getItems<T>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {};
    
    keys.forEach(key => {
      result[key] = this.getItem<T>(key);
    });
    
    return result;
  }

  /**
   * Watch for changes to a specific key
   */
  static watchItem<T>(
    key: string, 
    callback: (newValue: T | null, oldValue: T | null) => void
  ): () => void {
    let currentValue = this.getItem<T>(key);
    
    const interval = setInterval(() => {
      const newValue = this.getItem<T>(key);
      
      if (JSON.stringify(newValue) !== JSON.stringify(currentValue)) {
        callback(newValue, currentValue);
        currentValue = newValue;
      }
    }, 1000);
    
    // Return cleanup function
    return () => clearInterval(interval);
  }

  /**
   * Simple encryption (not cryptographically secure, just obfuscation)
   */
  private static encrypt(text: string): string {
    try {
      return btoa(text.split('').map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length))
      ).join(''));
    } catch (error) {
      console.error('Encryption failed:', error);
      return text;
    }
  }

  /**
   * Simple decryption
   */
  private static decrypt(encryptedText: string): string {
    try {
      const decoded = atob(encryptedText);
      return decoded.split('').map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length))
      ).join('');
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedText;
    }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get remaining storage quota (approximate)
   */
  static getRemainingQuota(): number {
    try {
      const testKey = '__quota_test__';
      let low = 0;
      let high = 10 * 1024 * 1024; // 10MB
      let current = 0;
      
      while (low <= high) {
        current = Math.floor((low + high) / 2);
        const testData = 'x'.repeat(current);
        
        try {
          localStorage.setItem(testKey, testData);
          localStorage.removeItem(testKey);
          low = current + 1;
        } catch (error) {
          high = current - 1;
        }
      }
      
      return high;
    } catch (error) {
      console.error('Failed to calculate remaining quota:', error);
      return 0;
    }
  }

  /**
   * Compress data before storing (simple compression)
   */
  static setCompressedItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      const compressed = this.compress(serialized);
      localStorage.setItem(this.PREFIX + key + '_compressed', compressed);
    } catch (error) {
      console.error('Failed to set compressed item:', error);
      // Fallback to regular storage
      this.setItem(key, value);
    }
  }

  /**
   * Get compressed data
   */
  static getCompressedItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const compressed = localStorage.getItem(this.PREFIX + key + '_compressed');
      if (!compressed) {
        return defaultValue || null;
      }
      
      const decompressed = this.decompress(compressed);
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('Failed to get compressed item:', error);
      // Fallback to regular storage
      return this.getItem(key, defaultValue);
    }
  }

  /**
   * Simple compression using run-length encoding
   */
  private static compress(str: string): string {
    return str.replace(/(.)\1+/g, (match, char) => {
      return match.length > 3 ? `${char}${match.length}` : match;
    });
  }

  /**
   * Simple decompression
   */
  private static decompress(str: string): string {
    return str.replace(/(.)\d+/g, (match, char) => {
      const count = parseInt(match.slice(1));
      return char.repeat(count);
    });
  }
}