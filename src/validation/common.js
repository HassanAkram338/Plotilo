const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId');
const orgRole = z.enum(['OWNER','ADMIN','MEMBER','GUEST']);

module.exports = { z, objectId, orgRole };
