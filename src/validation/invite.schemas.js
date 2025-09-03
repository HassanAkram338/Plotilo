const { z, objectId } = require('./common');

// POST /organizations/:orgId/invites
const invitationCreationSchema = {
  params: z.object({ orgId: objectId }),
};

module.exports = { invitationCreationSchema };
