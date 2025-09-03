const { z, objectId } = require('./common');

// POST /organizations
const createOrgSchema = {
  body: z.object({
    name: z.string().min(2).max(100),
    slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/, 'Use lowercase, digits, hyphens'),
  }),
};

// GET /organizations/:orgId
const getOneOrgSchema = {
  params: z.object({ orgId: objectId }),
};

// PATCH/PUT /organizations/:orgId
const updateOrgSchema = {
  params: z.object({ orgId: objectId }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
  }).refine(data => Object.keys(data).length > 0, { message: 'No fields to update' }),
};

// DELETE /organizations/:orgId
const deleteOrgSchema = {
  params: z.object({ orgId: objectId }),
};

module.exports = { createOrgSchema, getOneOrgSchema, updateOrgSchema, deleteOrgSchema };
