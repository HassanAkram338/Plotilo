const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.hashPassword = (plain) => bcrypt.hash(plain, 12);
exports.verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);

// random tokens (for refresh/email etc.)
exports.randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

// store only hashes of tokens
exports.sha256 = (str) => crypto.createHash('sha256').update(str).digest('hex');
