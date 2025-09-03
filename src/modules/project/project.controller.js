const svc = require('./project.service');

exports.createProject = async (req, res, next) => {
  try {
    const result = await svc.create({ orgId: req.org.id, body: req.body });
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
};

exports.listProjects = async (req, res, next) => {
  try {
    const result = await svc.list(req.org.id);
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const result = await svc.get({
      orgId: req.org.id,
      projectId: req.params.projectId,
    });
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const result = await svc.update({
      orgId: req.org.id,
      projectId: req.params.projectId,
      body: req.body,
    });
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
};


exports.deleteProject = async (req, res, next) => {
  try {
    const result = await svc.remove({
      orgId: req.org.id,
      projectId: req.params.projectId,
    });
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
};
