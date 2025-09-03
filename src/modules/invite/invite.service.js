const prisma = require('../../prisma/client');
const { randomToken, sha256 } = require('../../utils/crypto');


exports.createInvite = async ({ orgId, email, creatorUserId }) => {
  const code = randomToken(20);
  const expiresAt = new Date(Date.now() + 1000*60*60*24*7); // 7 days
  const invite = await prisma.invite.create({
    data: {
      organizationId: orgId,
      email,
      codeHash: sha256(code),
      expiresAt,
      status: 'PENDING',
    },
  });
  
  // TODO enqueue email with the plain code
  return { invite, code }; // return code once (show/send to user)
};

exports.acceptInvite = async ({ code, userId }) => {
  const codeHash = sha256(code);
  const inv = await prisma.invite.findFirst({ where: { codeHash, status: 'PENDING' } });
  if (!inv) throw new Error('Invalid or used invite');
  if (inv.expiresAt < new Date()) throw new Error('Invite expired');

  // idempotent membership create
  await prisma.membership.upsert({
    where: { userId_organizationId: { userId, organizationId: inv.organizationId } },
    update: {},
    create: { userId, organizationId: inv.organizationId, role: 'MEMBER' },
  });

  await prisma.invite.update({ where: { id: inv.id }, data: { status: 'ACCEPTED' } });
  return { organizationId: inv.organizationId };
};
