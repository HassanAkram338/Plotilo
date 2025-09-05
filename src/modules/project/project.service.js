const prisma = require('../../prisma/client');
const { NotFoundError } = require('../../utils/errors');
const { assertOrgScope } = require('../../utils/orgScope');

exports.create = ({ orgId, body }) =>
  prisma.project.create({
    data: { ...body, organizationId: orgId },
  });

exports.list = (orgId) =>
  prisma.project.findMany({
    where: assertOrgScope({}, orgId),
    orderBy: { createdAt: 'desc' },
  });

exports.get = async ({ orgId, projectId }) => {
  const p = await prisma.project.findFirst({
    where: assertOrgScope({ id: projectId }, orgId),
  });
  if (!p) throw NotFoundError('Project not found');
  return p;
};

exports.update = async ({ orgId, projectId, body }) => {
  
  const exists = await prisma.project.findFirst({
    where: assertOrgScope({ id: projectId }, orgId),
  });

  if (!exists) throw NotFoundError('Project not found');
  return prisma.project.update({ where: { id: projectId }, data: body });
};

exports.remove = async ({ orgId, projectId }) => {
  const exists = await prisma.project.findFirst({
    where: assertOrgScope({ id: projectId },orgId),
  });
  if (!exists) throw NotFoundError('Project not found');
  const deletedProject = await prisma.project.delete({
    where: { id: projectId },
  });
  return deletedProject;
};
