const { z, objectId } = require('./common');

exports.orgIdParamSchema = z.object({
  orgId: objectId,
  projectId: z.string().optional(), // if you want separate schema for that, create another
});

exports.createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

exports.updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});
