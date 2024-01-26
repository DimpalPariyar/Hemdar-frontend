const _ = require('lodash');
const riskScores = require('../data/self_risk.json');
const {
  userGender,
  userResidentialStatus,
  userStatus,
  userAccess,
  userRedirectionBroker,
} = require('../data/constants');
const userResponse = (plainUser) => {
  if (plainUser.gender !== undefined) {
    plainUser.gender = {
      value: plainUser.gender,
      label: userGender[plainUser.gender],
    };
  }
  plainUser.redirectionBroker = {
    value: plainUser.redirectionBroker,
    label: userRedirectionBroker[plainUser.redirectionBroker],
  };
  if (plainUser.residential !== undefined) {
    plainUser['residential'] = {
      value: plainUser.residential,
      label: userResidentialStatus[plainUser.residential],
    };
  }
  plainUser['status'] = {
    value: plainUser.status,
    label: userStatus[plainUser.status],
  };
  if (plainUser.panNumber !== undefined) {
    plainUser['kycStatus'] = {
      value: 1,
      label: 'Verified',
    };
  } else {
    plainUser['kycStatus'] = {
      value: 0,
      label: 'Not Verified',
    };
  }
  const total = plainUser.score;
  let scoreName = '';
  let scoreDescription = '';
  riskScores.map((item) => {
    if (item.low <= total && item.high >= total) {
      scoreName = item.name;
      scoreDescription = item.description;
    }
  });
  plainUser['score'] = {
    value: plainUser.score,
    scoreName,
    scoreDescription,
  };
  plainUser['type'] = _.map(plainUser.type, function extractType(userType) {
    return {
      value: userType,
      label: userAccess[userType],
    };
  });
  return plainUser;
};

// const version = appversion

module.exports = {
  userResponse,
};
