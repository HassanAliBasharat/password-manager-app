const CryptoJS = require('crypto-js');

const SECRET = process.env.ENCRYPTION_SECRET || 'default-secret-key';

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET).toString();
};

const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };
