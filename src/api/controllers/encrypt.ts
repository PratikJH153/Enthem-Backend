import crypto from 'crypto';

function encrypt(text, secretKey) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(secretKey, salt, 100000, 32, 'sha256');
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${salt.toString('hex')}:${iv.toString('hex')}:${encrypted}`;
}

function decrypt(data, secretKey) {
  const [saltString, ivString, encrypted] = data.split(':');
  const salt = Buffer.from(saltString, 'hex');
  const iv = Buffer.from(ivString, 'hex');
  const key = crypto.pbkdf2Sync(secretKey, salt, 100000, 32, 'sha256');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export { encrypt, decrypt };
