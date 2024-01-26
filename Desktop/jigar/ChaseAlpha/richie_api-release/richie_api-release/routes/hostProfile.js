const express = require('express');
const router = express.Router();
const checkAuth = require('../utils/checkAuth');
const HostProfileController = require('../controller/hostProfile.controller');
const checkHostExistsInParam = require('../middlewares/checkHostExistsInParam');

// Host Profile
//ADMIN
router.get(
  '/all',
  // checkAuth.hasSuperAdminPermission,
  HostProfileController.getAllHostProfiles
);
router.get(
  '/types',
  checkAuth.hasSuperAdminPermission,
  HostProfileController.getHostProfileTypes
);
// we may need GET one api
router.post(
  '/',
  checkAuth.hasSuperAdminPermission,
  HostProfileController.addHostProfile
);
router.put(
  '/:hostProfileId',
  checkAuth.hasSuperAdminPermission,
  checkHostExistsInParam.ishostProfileExists,
  HostProfileController.updateHostProfiles
);
router.delete(
  '/:hostProfileId',
  checkAuth.hasSuperAdminPermission,
  checkHostExistsInParam.ishostProfileExists,
  HostProfileController.deleteHostProfile
);

module.exports = router;
