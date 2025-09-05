const prisma = require('../../prisma/client');
const { assertOrgScope } = require('../../utils/orgScope');
const { NotFoundError } = require('../../utils/errors');

exports.createOrg = async ({ name, slug, ownerId }) => {
  return await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: { name, slug, ownerId },
    });
    await tx.membership.create({
      data: { userId: ownerId, organizationId: org.id, role: 'OWNER' },
    });
    return org;
  });
};

exports.updateOrganization = async (orgId, data) => {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!org) throw NotFoundError('Organization Not Found');

  return await prisma.organization.update({
    where: { id: orgId },
    data,
  });
};

exports.deleteOrganization = async (orgId) => {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!org) throw NotFoundError('Organization Not Found');

  await prisma.membership.deleteMany({ where: assertOrgScope({}, orgId) });

  return await prisma.organization.delete({
    where: { id: orgId },
  });
};

exports.getMyOrgs = async (userId) => {
  return await prisma.membership.findMany({
    where: { userId },
    include: { Organization: true },
    orderBy: { joinedAt: 'desc' },
  });
};

exports.getOrgById = async (id) => {
  const org = await prisma.organization.findUnique({ where: { id } });
  if (!org) throw NotFoundError('Organization Not Found');
  return org;
};
