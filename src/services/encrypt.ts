import * as crypto from 'crypto';

export function encrypt(data: string, key: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const ivString = iv.toString('base64');
    return `${encrypted}|${ivString}`;
  }
  
  // Decryption
  export function decrypt(cipher: string, randomKey: string): string {
    const [cipherText, ivString] = cipher.split('|');
    const iv = Buffer.from(ivString, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-ctr', randomKey, iv);
    let decrypted = decipher.update(cipherText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
