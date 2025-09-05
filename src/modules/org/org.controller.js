const svc = require('./org.service');
exports.postCreate = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    const org = await svc.createOrg({ name, slug, ownerId: req.user.id });
    res.status(201).json({ success: true, data: org });
  } catch (e) {
    next(e);
  }
};

exports.postUpdate = async (req, res, next) => {
  try {
    const updatedOrg = await svc.updateOrganization(req.org.id, req.body);
    res.status(201).json({ success: true, data: updatedOrg });
  } catch (e) {
    next(e);
  }
};

exports.postDelete = async (req, res, next) => {
  try {
    const result = await svc.deleteOrganization(req.org.id);
    res.status(201).json({
      success: true,
      message: 'Organization deleted successfully',
      result,
    });
  } catch (e) {
    next(e);
  }
};

exports.getMine = async (req, res, next) => {
  try {
    const list = await svc.getMyOrgs(req.user.id);
    res.json({ success: true, data: list.map((m) => m.Organization) });
  } catch (e) {
    next(e);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const orgId = req.org.id;
    const org = await svc.getOrgById(orgId);
    res.json({ success: true, data: org });
  } catch (e) {
    next(e);
  }
};
