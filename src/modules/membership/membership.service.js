const prisma = require('../../prisma/client');

exports.listMembers = (orgId) =>
  prisma.membership.findMany({
    where: { organizationId: orgId },
    // include: { Organization: true }, // optional: fetch user details
  });

  
exports.getMember = async ({ orgId, memberId }) => {
  const member = await prisma.membership.findUnique({ where: { id: memberId } });
  if (!member || member.organizationId !== orgId) throw new Error('Not found');
  return member;
};

exports.changeRole = async ({ orgId, memberId, role }) => {
  const member = await prisma.membership.findUnique({ where: { id: memberId } });
  if (!member || member.organizationId !== orgId) throw new Error('Not found');

  // prevent downgrading last OWNER
  if (member.role === 'OWNER' && role !== 'OWNER') {
    const owners = await prisma.membership.count({
      where: { organizationId: orgId, role: 'OWNER' },
    });
    if (owners <= 1) throw new Error('Cannot downgrade last OWNER');
  }

  return prisma.membership.update({ where: { id: memberId }, data: { role } });
};

exports.removeMember = async ({ orgId, memberId }) => {
  const member = await prisma.membership.findUnique({ where: { id: memberId } });
  if (!member || member.organizationId !== orgId) throw new Error('Not found');
  if (member.role === 'OWNER') throw new Error('Cannot remove OWNER');
  await prisma.membership.delete({ where: { id: memberId } });
  return true;
};

exports.transferOwnership = async ({ orgId, fromUserId, toMemberId }) => {
  // ensure current user is OWNER
  const currentOwner = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId: fromUserId, role: 'OWNER' },
  });
  if (!currentOwner) throw new Error('Only OWNER can transfer ownership');

  const newOwner = await prisma.membership.findUnique({ where: { id: toMemberId } });
  if (!newOwner || newOwner.organizationId !== orgId) throw new Error('Invalid target member');

  // demote current owner to ADMIN, promote new owner
  await prisma.membership.update({ where: { id: currentOwner.id }, data: { role: 'ADMIN' } });
  return prisma.membership.update({ where: { id: newOwner.id }, data: { role: 'OWNER' } });
};

exports.leaveOrganization = async ({ orgId, userId }) => {
  const membership = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId },
  });
  if (!membership) throw new Error('Not a member');
  if (membership.role === 'OWNER') throw new Error('OWNER cannot leave organization');
  await prisma.membership.delete({ where: { id: membership.id } });
  return true;
};
