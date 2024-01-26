const express = require('express');
const router = express.Router();
const checkAuth = require("../utils/checkAuth");
const TermsAgreementController = require("../controller/termsAgreement.controller");
const PrivacyAgreementController = require("../controller/privacyAgreement.controller");

// TermsAgreements APIs
//APP
router.get('/termsAndConditions/latest', TermsAgreementController.getLatestTermsAgreement); // get latest term and condition agreement
//ADMIN
router.get('/terms', checkAuth.hasSuperAdminPermission, TermsAgreementController.getAllTermsAgreements); // get all agreements
router.get('/terms/:termsAgreementId', checkAuth.hasSuperAdminPermission, TermsAgreementController.getOneTermsAgreement); // get one term agreement
router.post('/terms', checkAuth.hasSuperAdminPermission, TermsAgreementController.addTermsAgreement); // create and add new terms agreement
router.put('/terms/:termsAgreementId', checkAuth.hasSuperAdminPermission, TermsAgreementController.modifyOneTermsAgreement); // put one term agreement
router.delete('/terms/:termsAgreementId', checkAuth.hasSuperAdminPermission, TermsAgreementController.deleteOneTermsAgreement); // delete one term agreement

// Privacy Agreements APIs
//APP
router.get('/privacyAgreement/latest', PrivacyAgreementController.getLatestPrivacyAgreement); // get latest term and condition agreement
//ADMIN
router.get('/privacy', checkAuth.hasSuperAdminPermission, PrivacyAgreementController.getAllPrivacyAgreements); // get all agreements
router.get('/privacy/:privacyAgreementId', checkAuth.hasSuperAdminPermission, PrivacyAgreementController.getOnePrivacyAgreement); // get one term agreement
router.post('/privacy', checkAuth.hasSuperAdminPermission, PrivacyAgreementController.addPrivacyAgreement); // create and add new terms agreement
router.put('/privacy/:privacyAgreementId', checkAuth.hasSuperAdminPermission, PrivacyAgreementController.modifyOnePrivacyAgreement); // put one term agreement
router.delete('/privacy/:privacyAgreementId', checkAuth.hasSuperAdminPermission, PrivacyAgreementController.deleteOnePrivacyAgreement); // delete one term agreement

module.exports = router;
