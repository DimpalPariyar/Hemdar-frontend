const axios = require('axios');
const moment = require('moment');
const riskScores = require('../data/self_risk.json');
const userModel = require('../model/user.model');
const ckycModel = require('../model/ckyc.model');
require('dotenv').config();
// const logger = require('../utils/logger');

function getEncodedToken() {
  const username = process.env.DIGIO_USERNAME;
  const password = process.env.DIGIO_PASSWORD;
  const token = `${username}:${password}`;
  return Buffer.from(token).toString('base64');
}

const getDocumentStatus = async (documentId) => {
  const encodedToken = getEncodedToken();
  
  const config = {
    method: 'get',
    url: `${process.env.DIGIO_SERVICE_URL}/v2/client/document/` + documentId,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + encodedToken,
    },
  };
  try {
    const response = await axios(config);
    return response.data.agreement_status;
  } catch (e) {
    throw e;
  }
};

const getDocumentSignedStatus = async (documentId) => {
  const encodedToken = getEncodedToken();
  const config = {
    method: 'get',
    url: `${process.env.DIGIO_SERVICE_URL}/v2/client/document/` + documentId,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + encodedToken,
    },
  };
  try {
    const response = await axios(config);
    let principleSigned = false;
    let userSigned = false;
    let expired = false;
    expired = response.data.agreement_status === 'expired';
    response.data.signing_parties.forEach((party) => {
      if (party.signature_type === 'aadhaar') {
        userSigned = party.status === 'signed';
      } else {
        principleSigned = party.status === 'signed';
      }
    });

    return {
      principleSigned,
      userSigned,
      expired,
    };
  } catch (e) {
    throw e;
  }
};

const downloadDocument = async (res,req,next) => {
  const documentId = req.params.id
  const encodedToken = getEncodedToken();
  const config = {
    method: 'get',
      url: `${process.env.DIGIO_SERVICE_URL}/v2/client/document/download?document_id=${documentId}`,
      responseType: 'stream',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + encodedToken,
    },
  };
  try {
    const response = await axios(config);
    if(!response){
      res.status(404).send({message:'document not found'})
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
    response.data.pipe(res.status(200).set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="document.pdf"'
    }));
  } catch (e) {
    throw e;
  }
};

const signInternal = async (documentId) => {
  const data = JSON.stringify({
    identifier: process.env.DIGIO_IDENTIFIER,
    document_id: documentId,
    reason: 'test',
    key_store_name: 'test',
  });

  const encodedToken = getEncodedToken();
  // logger.log('info', 'sign internal data', {
  //   tags: 'eSign',
  //   additionalInfo: {
  //     data: {
  //       identifier: process.env.DIGIO_IDENTIFIER,
  //       document_id: documentId,
  //       reason: 'test',
  //       key_store_name: 'test',
  //       username: process.env.DIGIO_USERNAME,
  //       password: process.env.DIGIO_PASSWORD,
  //       encodedToken,
  //       server: process.env.DIGIO_SIGNING_SERVER,
  //     },
  //   },
  // });
  const internalSignRequest = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.DIGIO_SIGNING_SERVER}/external_signer/signdoc`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + encodedToken,
    },
    data: data,
  };

  try {
    return await axios(internalSignRequest);
  } catch (error) {
    // logger.log('error', 'sign internal error', {
    //   tags: 'eSign',
    //   additionalInfo: { errorMessage: error.message, error },
    // });
    console.log(error);
    throw error;
  }
};

const getGSTInfo = async (gstNo) => {
  const data = JSON.stringify({
    id_no: gstNo,
  });
  const encodedToken = getEncodedToken();
  const config = {
    method: 'post',
    url: `${process.env.DIGIO_SERVICE_URL}/v3/client/kyc/fetch_id_data/GST`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + encodedToken,
    },
    data,
  };
  try {
    const response = await axios(config);
    const {
      corporate_name,
      details: {
        pradr: { addr },
      },
    } = response.data;
    let address = '';
    for (const key in addr) {
      if (addr[key]) {
        address = address ? `${address}, ${addr[key]}` : addr[key];
      }
    }
    const details = {
      company: corporate_name,
      address,
      state: addr.stcd,
    };
    return details;
  } catch (e) {
    throw e;
  }
};

const generateDocumentAndRequestSign = async (
  user,
  identifierType,
  product,
  advisor
) => {
  let identifier;
  if (identifierType === 'email') {
    identifier = user.email;
  } else if (identifierType === 'mobile') {
    identifier = user.mobile;
  }
  let riskType = 'High Risk Client Apettite';
  riskScores.map((item) => {
    if (item.low <= user.score && item.high >= user.score) {
      riskType = item.name;
    }
  });
  const data = JSON.stringify({
    signers: [
      {
        identifier: identifier,
        name: user.name,
        sign_type: 'aadhaar',
        reason: 'Sign requested for subscribing the Advisory: ' + product.title,
      },
      {
        identifier: process.env.DIGIO_IDENTIFIER,
        name: 'Chase Alpha',
        sign_type: 'external',
        reason: 'Advisory Subscription for ' + product.title,
      },
    ],
    expire_in_days: process.env.ESIGN_VALIDITY_DAYS,
    sequential: true,
    send_sign_link: false,
    notify_signers: false,
    //display_on_page: 'custom',
    templates: [
      {
        template_key: process.env.DIGIO_TEMPLATE_ID,
        template_values: {
          ia_name: 'Chase Alpha Partners LLP',
          full_date: moment().format('MMMM Do YYYY, h:mm a'),
          place: 'Mumbai',
          sebi_reg_no: 'INA000016843',
          website_url: 'https://richie.club',
          client_risk_score: user.riskScore,
          adviser_phone: advisor.phone,
          adviser_email: advisor.email,
          adviser_address: advisor.address,
          date: moment().format('DD/MM/YYYY'),
          client_full_name: user.name,
          client_address: user.address,
          client_email: user.email,
          client_pan: user.panNumber,
          client_mobile: user.mobile,
          client_id: user._id,
          client_risk_type: riskType,
          firm_registration_number: 'AAQ-5731 (AM9)',
          sebi_registration_number: 'INA000016843 (AM2)',
          product_title: product.title,
          plan_name: product.plan_name,
          amount: product.amount,
        },
      },
    ],
    generate_access_token: true,
  });
  const encodedToken = getEncodedToken();
  const signRequest = {
    method: 'post',
    url: `${process.env.DIGIO_SERVICE_URL}/v2/client/template/multi_templates/create_sign_request`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + encodedToken,
    },
    data: data,
  };
  try {
    // logger.log('info', 'calling digio service for sign request', {
    //   tags: 'digio',
    // });
    const signResponse = await axios(signRequest);
    const documentId = signResponse.data.id;
    const token = signResponse.data.access_token.id;
    return {
      documentId,
      identifier,
      token,
    };
  } catch (error) {
    // logger.log('error', 'generated documents sign error', {
    //   tags: 'digio',
    //   additionalInfo: { errorMessage: error.message, error },
    // });
    console.log(error);
    throw error;
  }
};

const getPanName = async (panNumber) => {
  const data = JSON.stringify({
    id_no: panNumber,
  });
  const encodedToken = getEncodedToken();
  const config = {
    method: 'post',
    url: `${process.env.DIGIO_SERVICE_URL}/v3/client/kyc/fetch_id_data/PAN`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + encodedToken,
    },
    data: data,
  };
  try {
    const response = await axios(config);
    return response.data.full_name;
  } catch (error) {
    // logger.log('error', 'pan name error', {
    //   tags: 'digio',
    //   additionalInfo: { errorMessage: error.message, error },
    // });
    throw error;
  }
};
const getCKYCdata = async(panNumber)=>{
  const data = JSON.stringify({
    id_no: panNumber
  });
  const encodedToken = getEncodedToken();
  const config = {
    method: 'post',
    url: `${process.env.DIGIO_SERVICE_URL}/v3/client/kyc/ckyc/search`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + encodedToken,
    },
    data: data,
  };
  try { 
    const response = await axios(config);
    return response.data
  } catch (error) {
    console.log(error)
  }
}
const getCKYCdataAndStoreIndb = async(userId)=>{
   try {
    const User = await userModel.findOne({_id:userId}).select(
      'panNumber dob'
    )
    const response = await getCKYCdata(User.panNumber)
    if (response?.success) {
      const userDob = moment(User.dob).format("DD-MM-YYYY");
      const downloadresponse = await downloadCKYCdata(
        userDob,
        response.search_response.ckyc_number
        );
        const savedData = {
          userId: User._id,
          ckycDownloadData: downloadresponse?.download_response,
          ...response.search_response,
        };
        
        try {
          const result = await ckycModel.create(savedData);
          return { success: true, result };
        } catch (error) {
        console.error(`Error saving CKYC data: ${error.message}`);
        return {
          success: false,
          error_message: `Error saving CKYC data: ${error.message}`,
        };
      }
    } 
    if(!response.success){
      return response 
    }
  }
  catch (error) {
   }
}
const downloadCKYCdata = async(dob,ckycNumber)=>{
  const data = JSON.stringify({
    ckyc_no: ckycNumber,
    date_of_birth:dob
  });
  const encodedToken = getEncodedToken();
  const config = {
    method: 'post',
    url: `${process.env.DIGIO_SERVICE_URL}/v3/client/kyc/ckyc/download`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + encodedToken,
    },
    data: data,
  };
  try { 
    const response = await axios(config);
    return response.data
    
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  getPanName,
  generateDocumentAndRequestSign,
  getDocumentStatus,
  signInternal,
  getGSTInfo,
  getDocumentSignedStatus,
  downloadDocument,
  getCKYCdata,
  downloadCKYCdata,
  getCKYCdataAndStoreIndb
};
