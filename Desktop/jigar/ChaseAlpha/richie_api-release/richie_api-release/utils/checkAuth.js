const User = require('../model/user.model');

const { verifyJwtToken } = require('../utils/jwt-token');
const UserModel = require('../model/user.model');
const TokenModel = require('../model/token.model');
const adviceModel = require('../model/advice.model');
const userModel = require('../model/user.model');

async function isValid(req, res, next) {
  try {
    // check for auth header from client
    const header = req.headers.authorization;
    if (!header) {
      next({ status: 403, message: 'Auth header is missing' });
      return;
    }
    // verify  auth token
    const token = header.split('Bearer ')[1];
    if (!token) {
      next({ status: 401, message: 'Auth token is missing' });
      return;
    }
    const user = verifyJwtToken(token, next);

    if (!user || !user.id) {
      next({ status: 401, message: 'Incorrect token' });
      return;
    }
    const existingToken = await TokenModel.findOne({ user: user.id }).lean();
    if (!existingToken) {
      return next({
        status: 401,
        message: 'Auth token verification failed please re login',
      });
    }
    // if (existingToken.accessToken !== token) {
    //   return next({
    //     status: 406,
    //     message: 'Logged in from another device',
    //   });
    // }
    const userData = await User.findById({ _id: user.id }).lean();
    if (userData.type.includes(4)) {
      userData.hasPermission = 4;
    } else if (userData.type.includes(0)) {
      userData.hasPermission = 0;
    }
    if (!userData) {
      next({
        status: 401,
        message: 'Auth token verification failed please re login',
      });
      return;
    }
    if (userData.status === 0) {
      next({ status: 401, message: 'The User is banned' });
      return;
    }
    res.locals.user = userData;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function isValidSocket(socket, next) {
  try {
    const header = socket.handshake.headers['authorization'];
    if (!header) {
      return next({ status: 403, message: 'Auth header is missing' });
    }

    const token = header.split('Bearer ')[1];

    if (!token) {
      return next({ status: 401, message: 'Auth token is missing' });
    }
    const user = verifyJwtToken(token, next);

    if (!user || !user.id) {
      return next({ status: 401, message: 'Incorrect token' });
    }

    const existingToken = await TokenModel.findOne({ user: user.id }).lean();
    if (!existingToken) {
      return next({
        status: 401,
        message: 'Auth token verification failed please re login',
      });
    }
    if (existingToken.accessToken !== token) {
      return next({
        status: 406,
        message: 'Logged in from another device',
      });
    }
    const userData = await User.findById({ _id: user.id }).lean();

    if (!userData) {
      return next({
        status: 401,
        message: 'Auth token verification failed please re login',
      });
    }
    if (userData.status === 0) {
      return next({ status: 401, message: 'The User is banned' });
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
}

const hasUserPermission = async (req, res, next) => {
  if (res.locals.user.type.includes(0)) {
    next();
  } else {
    next({ status: 403, message: 'Only User has access' });
  }
};
const hasReasearchAdminPermission = async(req,res,next)=>{
  if(res.locals.user.type.includes(5)){
    next();
  }else {
    next({status:403,message:'Only Reasearch has access'})
  }
}
const hasAdvisoryPermission = async (req, res, next) => {
  if (res.locals.user.type.includes(1) || res.locals.user.type.includes(4)) {
    next();
  } else {
    next({ status: 403, message: 'Only Advisor has access' });
  }
};

const hasLearnAdminPermission = async (req, res, next) => {
  if (res.locals.user.type.includes(2) || res.locals.user.type.includes(4)) {
    next();
  } else {
    next({ status: 403, message: 'Only Learn Admin has access' });
  }
};

const hasSupportPermission = async (req, res, next) => {
  if (res.locals.user.type.includes(6) || res.locals.user.type.includes(4)) {
    next();
  } else {
    next({ status: 403, message: 'Only sales Admin has access' });
  }
};

const hasTradeFlashPermission = async (req, res, next) => {
  if (res.locals.user.type.includes(3) || res.locals.user.type.includes(4)) {
    next();
  } else {
    next({
      status: 403,
      message: 'Only Trade Flash Admin or Advisory Admin has access',
    });
  }
};

const hasSuperAdminPermission = async (req, res, next) => {
  if (
    res.locals.user.type.includes(4) ||
    res.locals.user.type.includes(8) 
  ) {
    next();
  } else {
    next({ status: 403, message: 'Only Super Admin has access' });
  }
};

const isAlreadyExist = async (req, res, next) => {
  const { email, mobile } = req.body;
  if (email === undefined && mobile === undefined) {
    next({ status: 403, message: 'Both Email and Mobile cannot be empty' });
  } else if (mobile !== undefined) {
    const count = await UserModel.countDocuments({ mobile });
    if (count > 0) {
      next({
        status: 409,
        success: false,
        message: 'Mobile number is already used by another User',
      });
    } else {
      next();
    }
  } else if (email !== undefined) {
    const count = await UserModel.countDocuments({ email });
    if (count > 0) {
      next({
        status: 409,
        success: false,
        message: 'Email id is already used by another User',
      });
    } else {
      next();
    }
  }
};

const checkUpdateAdvicePermission = async(adviceId,userId) =>{
try {
  const adviceProduct = await adviceModel.findById(adviceId)
  const UserPermissions = await userModel.findById(userId)
  if (UserPermissions.type?.includes(4))return true
  if(UserPermissions?.updateAccess?.product?.includes(adviceProduct?.advisoryId?.productTitle)){
    console.log('Permission Granted')
    return true
  }else{
    console.log('Permission Denied')
    return false
  }
} catch (error) {
  console.log(error)
}   
}
module.exports = {
  isValidSocket,
  isValid: isValid,
  isAlreadyExist: isAlreadyExist,
  hasUserPermission: [isValid, hasUserPermission],
  hasAdvisoryPermission: [isValid, hasAdvisoryPermission],
  hasLearnAdminPermission: [isValid, hasLearnAdminPermission],
  hasTradeFlashPermission: [isValid, hasTradeFlashPermission],
  hasSuperAdminPermission: [isValid, hasSuperAdminPermission],
  hasSupportPermission: [isValid, hasSupportPermission],
  hasReasearchAdminPermission: [isValid, hasReasearchAdminPermission],
  checkUpdateAdvicePermission,
};
