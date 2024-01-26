const express = require('express');
const router = express.Router();
const checkAuth = require('../utils/checkAuth');
const riskProfileController = require('../controller/riskProfile.controller');

/* GET all risk profile questions (ADMIN & CLIENT) */
router.get('/all', riskProfileController.getAllRiskProfileQuestions); // get all scorecard and questions

// ADMIN APIs
router.post(
  '/question/add',
  checkAuth.hasSuperAdminPermission,
  (req, res, next) =>
    riskProfileController.addRiskProfileQuestion(req, res, next)
); // add new question
router.put(
  '/question/:questionId/update',
  checkAuth.hasSuperAdminPermission,
  (req, res, next) =>
    riskProfileController.updateRiskProfileQuestion(req, res, next)
); // update question
router.delete(
  '/question/:questionId/delete',
  checkAuth.hasSuperAdminPermission,
  (req, res, next) =>
    riskProfileController.deleteRiskProfileQuestion(req, res, next)
); // delete question
router.post('/scorecard', checkAuth.hasSuperAdminPermission, (req, res, next) =>
  riskProfileController.updateRiskProfileScoreCard(req, res, next)
); // add or update score card

// CLIENT APIs
router.post(
  '/scoreCard/userResponse',
  checkAuth.hasUserPermission,
  (req, res, next) =>
    riskProfileController.getScoreCardUserResponse(req, res, next)
); // scorecard user response returns score
router.post(
  '/questions/userResponse',
  checkAuth.hasUserPermission,
  (req, res, next) =>
    riskProfileController.getQuestionsUserResponse(req, res, next)
); // questions user response returns score

router.get(
  '/risktestUsermap',(req,res,next)=>riskProfileController.mapQuestionAndResponseOnScore(req,res,next)
)
// DOUBT: do we have to add new field in user model for risk profile completion eg:Boolean

module.exports = router;
