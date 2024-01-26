const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const constructQuery = require('../middlewares/constructQuery');
const checkAuth = require('../utils/checkAuth');
const ProgramSessionController = require('../controller/programSession.controller');
const LearnerController = require('../controller/learner.controller');
const crud = require('../controller/crud');
const ProgramSessionModel = require('../model/programSession.model');
const { SessionPlans } = require('../model/price.model');
const SessionQuestions = require('../model/sessionQuestion.model');
const SessionBroadcast = require('../model/sessionBroadcast.model');
const SuperCourseModel = require('../model/superCourse.model');
const checkHasValidIds = require('../middlewares/checkHasValidIds');
const checkValidId = require('../middlewares/checkValidId');
const {
  language: LanguageModel,
} = require('../model/genericSingleValue.model');
const { level: LevelModel } = require('../model/genericSingleValue.model');
const LinkModel = require('../model/link.model');
const insertRelationData = require('../middlewares/insertRelationData');
const addSuperCourseType = require('../middlewares/addSuperCourseType');
const addUserId = require('../middlewares/addUserId');
const host = require('../model/hostProfile.model');
const courseType = require('../constants/courseType');
const {
  removePurchased,
  isPurchased,
  removeSessionsThatArePast,
} = require('../middlewares/filterQuery');

router.get(
  '/dashboard/superCourses',
  checkAuth.hasUserPermission,
  (req, res, next) =>
    LearnerController.getAllPurchasedSuperCourses(req, res, next)
);
router.get(
  '/dashboard/programSessions',
  checkAuth.hasUserPermission,
  (req, res, next) => LearnerController.getAllPurchasedSessions(req, res, next)
);
router.post('/session-create', (req, res, next) =>
  ProgramSessionController.createProgramSession(req, res, next)
);
router.use(
  '/session',
  [
    checkAuth.isValid,
    removePurchased('_id', 'purchasedSessions'),
    removeSessionsThatArePast(),
  ],
  crud(ProgramSessionModel)
);
router.get('/session-user',
 checkAuth.hasUserPermission,
 (req,res,next)=>LearnerController.getUserSessions(req,res,next)
)
router.use('/plan', crud(SessionPlans));
router.use(
  '/question',
  [
    checkAuth.isValid,
    checkValidId(ProgramSessionModel, 'sessionId'),
    isPurchased('sessionId', 'purchasedSessions'),
    constructQuery(),
    addUserId(),
  ],
  crud(SessionQuestions)
);
router.post(
  '/answer',
  [
    checkAuth.hasSuperAdminPermission,
    check('question', 'Please send the question')
      .escape()
      .exists({ checkFalsy: true }),
    checkValidId(SessionQuestions, 'questionId'),
  ],
  (req, res, next) => ProgramSessionController.addAnswer(req, res, next)
);
router.use(
  '/broadcast',
  [
    checkAuth.isValid,
    isPurchased('sessionId', 'purchasedSessions'),
    constructQuery(),
  ],
  crud(SessionBroadcast)
);
router.post(
  '/sessions/broadcast/reaction',
  checkAuth.isValid,
  (req, res, next) => ProgramSessionController.addReaction(req, res, next)
);
router.delete(
  '/sessions/broadcast/reaction',
  checkAuth.isValid,
  (req, res, next) => ProgramSessionController.deleteReaction(req, res, next)
);

router.use('/language', crud(LanguageModel));
router.use('/level', crud(LevelModel));
router.get(
  '/sessions/month/:month/year/:year',
  [
    checkAuth.isValid,
    removePurchased('_id', 'purchasedSessions'),
    removeSessionsThatArePast(),
  ],
  (req, res, next) =>
    ProgramSessionController.getAllSessionByMonth(req, res, next)
);
router.post(
  '/sessions/cart',
  checkAuth.hasUserPermission,
  checkHasValidIds(ProgramSessionModel, 'sessionIds'),
  (req, res, next) => LearnerController.sessionSelection(req, res, next)
);
router.post(
  '/sessions/reshedule/swap',
  [
    check('sessionIds').isArray(),
    check('newSessionIds').isArray(),
    check('sessionIds')
      .custom((value, { req }) => {
        return value.length === req.body.newSessionIds.length;
      })
      .withMessage(
        'sessionIds and sessionIds must have the same length for rescheduling'
      ),
    checkAuth.hasUserPermission,
    checkHasValidIds(ProgramSessionModel, 'sessionIds'),
    checkHasValidIds(ProgramSessionModel, 'newSessionIds'),
  ],
  (req, res, next) => LearnerController.swapSessions(req, res, next)
);
router.post(
  '/sessions/reshedule/cancel',
  [
    check('sessionIds').isArray(),
    checkAuth.hasUserPermission,
    checkHasValidIds(ProgramSessionModel, 'sessionIds'),
  ],
  (req, res, next) => LearnerController.cancelSessions(req, res, next)
);
router.post(
  '/sessions/reshedule/assign',
  [
    check('newSessionIds').isArray(),
    checkAuth.hasUserPermission,
    checkHasValidIds(ProgramSessionModel, 'newSessionIds'),
  ],
  (req, res, next) => LearnerController.assignSessions(req, res, next)
);

router.use('/webinar', [
  checkHasValidIds(LanguageModel, 'languageIds'),
  insertRelationData(LinkModel, 'linkIds', 'linkIds'),
  checkValidId(LevelModel, 'levelId'),
  checkValidId(host, 'hostProfileId'),
  constructQuery(),
  addSuperCourseType(courseType.webinar),
  crud(SuperCourseModel),
]);

module.exports = router;
