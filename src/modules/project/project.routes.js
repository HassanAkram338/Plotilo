const router = require('express').Router();
const { requireAuth } = require('../../middlewares/auth');
const { requireOrgRole } = require('../../middlewares/orgAuth');
const { validate } = require('../../middlewares/validate'); 
const c = require('./project.controller');
const { checkPlanLimit } = require('../../middlewares/planCheck');
const { createProjectSchema, updateProjectSchema, orgIdParamSchema } = require('../../validation/project.schemas');

router.post('/:orgId/projects',
  requireAuth,
  validate({ params: orgIdParamSchema, body: createProjectSchema }),
  requireOrgRole(['OWNER','ADMIN']),
  checkPlanLimit('PROJECTS'),
  c.createProject
);



router.get('/:orgId/projects',
  requireAuth,
  validate({ params: orgIdParamSchema }),
  requireOrgRole(['OWNER','ADMIN','MEMBER','GUEST']),
  c.listProjects
);

router.get('/:orgId/projects/:projectId',
  requireAuth,
  validate({ params: orgIdParamSchema }),
  requireOrgRole(['OWNER','ADMIN','MEMBER','GUEST']),
  c.getProject
);

router.put('/:orgId/projects/:projectId',
  requireAuth,
  validate({ params: orgIdParamSchema, body: updateProjectSchema }),
  requireOrgRole(['OWNER','ADMIN']),
  c.updateProject
);

router.delete('/:orgId/projects/:projectId',
  requireAuth,
  validate({ params: orgIdParamSchema }),
  requireOrgRole(['OWNER','ADMIN']),
  c.deleteProject
);

module.exports = router;
