const prisma = require('../../prisma/client');
const { assertOrgScope } = require('../../utils/orgScope');
const { NotFoundError, ForbiddenError } = require('../../utils/errors');

exports.listMembers = (orgId) =>
  prisma.membership.findMany({
    where: assertOrgScope({}, orgId),
    // include: { Organization: true }, // optional: fetch user details
  });

exports.getMember = async ({ orgId, memberId }) => {
  const member = await prisma.membership.findFirst({
    where: assertOrgScope({ id: memberId }, orgId),
  });
  if (!member) throw NotFoundError('Membership not found in this organization');
  return member;
};

exports.changeRole = async ({ orgId, memberId, role }) => {
  const member = await prisma.membership.findFirst({
    where: assertOrgScope({ id: memberId }, orgId),
  });

  if (!member) throw NotFoundError('Membership not found in this organization');

  // prevent downgrading last OWNER
  if (member.role === 'OWNER' && role !== 'OWNER') {
    const owners = await prisma.membership.count({
      where: assertOrgScope({ role: 'OWNER' }, orgId),
    });
    if (owners <= 1) throw ForbiddenError('Cannot downgrade last OWNER');
  }

  return prisma.membership.update({ where: { id: memberId }, data: { role } });
};

exports.removeMember = async ({ orgId, memberId }) => {
  const member = await prisma.membership.findFirst({
    where: assertOrgScope({ id: memberId }, orgId),
  });
  if (!member) throw NotFoundError('Membership not found in this organization');

  if (member.role === 'OWNER')
    throw ForbiddenError('Cannot remove OWNER member');
  await prisma.membership.delete({ where: { id: memberId } });
  return true;
};

exports.transferOwnership = async ({ orgId, fromUserId, toMemberId }) => {
  // ensure current user is OWNER
  const currentOwner = await prisma.membership.findFirst({
    where: assertOrgScope({ userId: fromUserId, role: 'OWNER' }, orgId),
  });
  if (!currentOwner) throw ForbiddenError('Only OWNER can transfer ownership');

  const newOwner = await prisma.membership.findFirst({
    where: assertOrgScope({ id: toMemberId }, orgId),
  });
  if (!newOwner) throw NotFoundError('Invalid target member');

  // demote current owner to ADMIN, promote new owner
  await prisma.membership.update({
    where: { id: currentOwner.id },
    data: { role: 'ADMIN' },
  });
  return prisma.membership.update({
    where: { id: newOwner.id },
    data: { role: 'OWNER' },
  });
};

exports.leaveOrganization = async ({ orgId, userId }) => {
  const membership = await prisma.membership.findFirst({
    where: assertOrgScope({ userId }, orgId),
  });
  if (!membership)
    throw NotFoundError('Membership not found in this organization');
  if (membership.role === 'OWNER')
    throw ForbiddenError('OWNER cannot leave organization');
  await prisma.membership.delete({ where: { id: membership.id } });
  return true;
};
