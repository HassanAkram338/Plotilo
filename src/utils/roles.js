const ORG_ROLE_ORDER = ['GUEST', 'MEMBER', 'ADMIN', 'OWNER'];
const ORG_ROLE_RANK = ORG_ROLE_ORDER.reduce(
  (previousValue, currentValue, index) => {
    previousValue[currentValue] = index;
    return previousValue;
  },
  {}
);

function roleAtLeast(userRole, requiredRole) {
  return ORG_ROLE_RANK[userRole] >= ORG_ROLE_RANK[requiredRole];
}

function isAllowedByList(userRole, allowedList = []) {
  return allowedList.includes(userRole);
}

module.exports = {
  ORG_ROLE_ORDER,
  ORG_ROLE_RANK,
  roleAtLeast,
  isAllowedByList,
};
