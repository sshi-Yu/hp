import * as crypto from 'crypto';
// 使用crypto加密密码数据。
// Encrypt password with given salt.  Return encrypted password as string.

const algorithm = 'aes-256-cbc';
const _salt = "__Y_X_X_L_X__X_X_X_X__Ein__";

export enum EncryptKey {
  Password = "__x__pwd"
}

export class Crypto {

  static encrypt(text: string, key: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, crypto.createHash('sha256').update(key + _salt).digest(), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  static decrypt(text: string, key: string): string {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    const decipher = crypto.createDecipheriv(algorithm, crypto.createHash('sha256').update(key + _salt).digest(), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  static compare(plainText: string, encryptedText: string, key: string) {
    const decryptedText = this.decrypt(encryptedText, key);
    return plainText === decryptedText;
  }
}

