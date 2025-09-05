const prisma = require('../../prisma/client');

exports.listMyMemberships = async (userId) => {
  return await prisma.membership.findMany({
    where: { userId },
    select: {
      id: true,
      role: true,
      Organization: {
        select: { id: true, name: true, slug: true, subscriptionPlan: true },
      },
    },
    orderBy: { joinedAt: 'desc' },
  });
};
