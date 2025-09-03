const prisma = require('../../prisma/client');

exports.createOrg = async ({ name, slug, ownerId }) => {
  const org = await prisma.organization.create({
    data: { name, slug, ownerId },
  });
  await prisma.membership.create({
    data: { userId: ownerId, organizationId: org.id, role: 'OWNER' },
  });
  return org;
};

exports.updateOrganization = async (orgId, data, userId) => {
  
  const org = await prisma.organization.update({
    where: { id: orgId },
    data,
  });

  if (!org) throw new Error('Organization not found');
  return org;
};

exports.deleteOrganization = async (orgId, userId) => {
  
  
 await prisma.membership.deleteMany({where : {organizationId : orgId}})

  const org = await prisma.organization.delete({
    where: { id: orgId },
  });
  if (!org) throw new Error('Organization not found');
  return org;
};

exports.getMyOrgs = async (userId) =>
  await prisma.membership.findMany({
    where: { userId },
    include: { Organization: true },
    orderBy: { joinedAt: 'desc' },
  });

exports.getOrgById = async (id) =>
  await prisma.organization.findUnique({ where: { id } });

exports.isMember = async (userId, orgId) =>
  await prisma.membership.findFirst({
    where: { userId, organizationId: orgId },
  });
