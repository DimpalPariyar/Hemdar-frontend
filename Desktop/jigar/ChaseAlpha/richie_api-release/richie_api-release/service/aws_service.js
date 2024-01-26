require("dotenv").config();
const AWS = require("aws-sdk");
const nodemailer= require('nodemailer')

const SESConfig = {
  apiVersion: "2010-12-01",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECERT_ACCESS_KEY,
  region: process.env.AWS_REGION,
};
AWS.config.update(SESConfig);

const triggerOTP = async (mobile, otp) => {
  const paramsValue = {
    Message:
      "<#> " +
      otp +
      " is your OTP for Richie. Please do not share it with anyone. Visit https://www.richie.club and enjoy Tradevesting!",
    PhoneNumber: "+91" + mobile,
    MessageAttributes: {
      "AWS.SNS.SMS.SenderID": {
        DataType: "String",
        StringValue: "57272231",
      },
      "AWS.SNS.SMS.SMSType": {
        DataType: "String",
        StringValue: "Transactional",
      },
    },
  };
  const publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" })
    .publish(paramsValue)
    .promise();
  return await publishTextPromise
    .then((data) => {
      return data.MessageId;
    })
    .catch((err) => {
      console.log("Error " + err);
      throw err;
    });
};

const triggerEmail = async (email, otp) => {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "Welcome! your email verification code is: " + otp,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "OTP for Richie",
      },
    },
    Source: "richie@chasealpha.in" /* required */,
  };

  const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();
  return await sendPromise
    .then(function (data) {
      return data.MessageId;
    })
    .catch(function (err) {
      console.error(err, err.stack);
      throw err;
    });
};

const triggerEmailInvoice = async (email, url) => {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "This is Your inVoice Url:" + url,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Invoice URl",
      },
    },
    Source: "richie@chasealpha.in",
  };
  const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();
  return await sendPromise
    .then(function (data) {
      return data.MessageId;
    })
    .catch(function (err) {
      console.error(err, err.stack);
      throw err;
    });
};

const triggerEmailForSecurityUpdate = async (email) => {
  const transporter = nodemailer.createTransport({SES:new AWS.SES({ apiVersion: "2010-12-01" })})
  // const emailAddress = process.env.SECURITY_EMAIL_ADDRESS
  const res =[]
  for(let i = 0 ; i<100;i++){
    const mailOptions = {
      from:`richie@chasealpha.in`,
      to:email[i],
      subject:'Cyber Security Update',
      html:`
              <!DOCTYPE HTML
              PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
              xmlns:o="urn:schemas-microsoft-com:office:office">
            
            <head>
              <!--[if gte mso 9]>
            <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta name="x-apple-disable-message-reformatting">
              <!--[if !mso]><!-->
              <meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
              <title></title>
            
              <style type="text/css">
                @media only screen and (min-width: 620px) {
                  .u-row {
                    width: 600px !important;
                  }
            
                  .u-row .u-col {
                    vertical-align: top;
                  }
            
                  .u-row .u-col-33p33 {
                    width: 199.98px !important;
                  }
            
                  .u-row .u-col-50 {
                    width: 300px !important;
                  }
            
                  .u-row .u-col-66p67 {
                    width: 400.02px !important;
                  }
            
                  .u-row .u-col-100 {
                    width: 600px !important;
                  }
            
                }
            
                @media (max-width: 620px) {
                  .u-row-container {
                    max-width: 100% !important;
                    padding-left: 0px !important;
                    padding-right: 0px !important;
                  }
            
                  .u-row .u-col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                  }
            
                  .u-row {
                    width: 100% !important;
                  }
            
                  .u-col {
                    width: 100% !important;
                  }
            
                  .u-col>div {
                    margin: 0 auto;
                  }
                }
            
                body {
                  margin: 0;
                  padding: 0;
                }
            
                table,
                tr,
                td {
                  vertical-align: top;
                  border-collapse: collapse;
                }
            
                p {
                  margin: 0;
                }
            
                .ie-container table,
                .mso-container table {
                  table-layout: fixed;
                }
            
                * {
                  line-height: inherit;
                }
            
                a[x-apple-data-detectors='true'] {
                  color: inherit !important;
                  text-decoration: none !important;
                }
            
                table,
                td {
                  color: #000000;
                }
            
                #u_body a {
                  color: #0000ee;
                  text-decoration: underline;
                }
            
                @media (max-width: 480px) {
                  #u_content_image_8 .v-container-padding-padding {
                    padding: 20px 10px 10px !important;
                  }
            
                  #u_content_image_8 .v-src-width {
                    width: auto !important;
                  }
            
                  #u_content_image_8 .v-src-max-width {
                    max-width: 40% !important;
                  }
            
                  #u_content_menu_1 .v-padding {
                    padding: 0px 10px 10px !important;
                  }
            
                  #u_content_image_1 .v-src-width {
                    width: auto !important;
                  }
            
                  #u_content_image_1 .v-src-max-width {
                    max-width: 100% !important;
                  }
            
                  #u_content_heading_1 .v-font-size {
                    font-size: 20px !important;
                  }
            
                  #u_content_text_1 .v-container-padding-padding {
                    padding: 5px 15px 30px !important;
                  }
            
                  #u_row_8.v-row-padding--vertical {
                    padding-top: 40px !important;
                    padding-bottom: 40px !important;
                  }
            
                  #u_content_image_5 .v-container-padding-padding {
                    padding: 0px 10px !important;
                  }
            
                  #u_content_image_5 .v-src-width {
                    width: auto !important;
                  }
            
                  #u_content_image_5 .v-src-max-width {
                    max-width: 49% !important;
                  }
            
                  #u_content_text_4 .v-container-padding-padding {
                    padding: 30px 20px 0px !important;
                  }
            
                  #u_content_text_4 .v-text-align {
                    text-align: center !important;
                  }
            
                  #u_content_text_9 .v-container-padding-padding {
                    padding: 8px 15px 0px !important;
                  }
            
                  #u_content_text_9 .v-text-align {
                    text-align: center !important;
                  }
            
                  #u_content_text_13 .v-container-padding-padding {
                    padding: 5px 50px 20px !important;
                  }
            
                  #u_row_2.v-row-padding--vertical {
                    padding-top: 40px !important;
                    padding-bottom: 40px !important;
                  }
            
                  #u_content_image_2 .v-container-padding-padding {
                    padding: 0px 10px !important;
                  }
            
                  #u_content_image_2 .v-src-width {
                    width: auto !important;
                  }
            
                  #u_content_image_2 .v-src-max-width {
                    max-width: 50% !important;
                  }
            
                  #u_content_text_2 .v-container-padding-padding {
                    padding: 30px 20px 0px 10px !important;
                  }
            
                  #u_content_text_2 .v-text-align {
                    text-align: center !important;
                  }
            
                  #u_content_text_3 .v-container-padding-padding {
                    padding: 8px 15px 0px !important;
                  }
            
                  #u_content_text_3 .v-text-align {
                    text-align: center !important;
                  }
                }
              </style>
            
            
            
              <!--[if !mso]><!-->
              <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css">
              <!--<![endif]-->
            
            </head>
            
            <body class="clean-body u_body"
              style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e7e7e7;color: #000000">
              <!--[if IE]><div class="ie-container"><![endif]-->
              <!--[if mso]><div class="mso-container"><![endif]-->
              <table id="u_body"
                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e7e7e7;width:100%"
                cellpadding="0" cellspacing="0">
                <tbody>
                  <tr style="vertical-align: top">
                    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e7e7e7;"><![endif]-->
            
            
                        
            
                      <div class="u-row-container v-row-padding--vertical" style="padding: 0px;background: linear-gradient(100.25deg, #3856EE 2.24%, #7775EC 96%);">
                        <div class="u-row"
                          style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                          <div
                            style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #5078bb;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
            
                            <!--[if (mso)|(IE)]><td align="center" width="200" style="width: 200px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-33p33"
                              style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
                              <div
                                style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div
                                  style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                  <!--<![endif]-->
            
                                  <table id="u_content_image_8" style="font-family:'Montserrat',sans-serif;" role="presentation"
                                    cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                              <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
            
                                                <img align="center" border="0" src="https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/images/logo-email.png" alt="Logo" title="Logo"
                                                  style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 69%;max-width: 124.2px;"
                                                  width="124.2" class="v-src-width v-src-max-width" />
            
                                              </td>
                                            </tr>
                                          </table>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <!--[if (!mso)&(!IE)]><!-->
                                </div><!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="400" style="width: 400px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                          </div>
                        </div>
                      </div>
            
            
            
            
            
                      <div class="u-row-container v-row-padding--vertical" style="padding: 0px;background-color: #ffffff">
                        <div class="u-row"
                          style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                          <div
                            style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
            
                            <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                            <div class="u-col u-col-100"
                              style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                              <div style="height: 100%;width: 100% !important;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div
                                  style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                  <!--<![endif]-->
            
                                  <table id="u_content_image_1" style="font-family:'Montserrat',sans-serif;" role="presentation"
                                    cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:60px 0px 30px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                              <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
            
                                                <img align="center" border="0" src="https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/images/image-9.png" alt="image" title="image"
                                                  style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 73%;max-width: 438px;"
                                                  width="438" class="v-src-width v-src-max-width" />
            
                                              </td>
                                            </tr>
                                          </table>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table id="u_content_heading_1" style="font-family:'Montserrat',sans-serif;" role="presentation"
                                    cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 0px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <h1 class="v-text-align v-font-size"
                                            style="margin: 0px; color: #000000; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Montserrat',sans-serif; font-size: 30px; font-weight: 400;">
                                            <strong>CYBERSECURITY TIPS</strong></h1>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table id="u_content_text_1" style="font-family:'Montserrat',sans-serif;" role="presentation"
                                    cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px 30px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <div class="v-text-align v-font-size"
                                            style="font-size: 14px; color: #222222; line-height: 140%; word-wrap: break-word;">
                                            <p style="font-size: 14px; line-height: 140%;">Dear Participant,<br>
            <br>
                                              Look around today's world, and you'll see that daily life is more dependent on technology than ever before. With so much good coming from technology, it can be hard to believe that potential threats lurk behind every device and platform. A steady rise in cybercrime highlights the flaws in devices and services we've come to depend on. This concern forces us to ask what cyber security is, why it's essential, and what to learn about it.
            <br>
            <br>                                  
                                              Cyber security is a discipline that covers how to defend devices and services from electronic attacks by nefarious actors such as hackers, spammers, and cybercriminals. Cyber security encompasses technologies, processes, and methods to defend computer systems, data, and networks from attacks. Cyber-attacks can cost you a fortune and impact privacy.
            <br>
            <br>                                  
                                              You and your safety is of paramount importance to us. Because of this, we are sending Cyber security introduction documents and training videos links to raise the awareness on cyber security. You play a significant role in keeping yourself and your data safe.
            <br>
            <br>                                  
                                              Please don’t hesitate to contact me if you have additional questions or need assistance.
            <br>                                  
                                              Thank you for staying cyber safe. </p>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <!--[if (!mso)&(!IE)]><!-->
                                </div><!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                          </div>
                        </div>
                      </div>
            
            
            
            
            
                      <!--[if gte mso 9]>
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;min-width: 320px;max-width: 600px;">
                    <tr>
                      <td background="https://cdn.templates.unlayer.com/assets/1658832091543-sca.png" valign="top" width="100%">
                  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 600px;">
                    <v:fill type="frame" src="https://cdn.templates.unlayer.com/assets/1658832091543-sca.png" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
                  <![endif]-->
            
                      <div id="u_row_8" class="u-row-container v-row-padding--vertical"
                        style="padding: 40px 0px 30px;background-color: #5078bb">
                        <div class="u-row"
                          style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                          <div
                            style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('images/image-10.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 40px 0px 30px;background-color: #5078bb;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-image: url('images/image-10.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;"><![endif]-->
            
                            <!--[if (mso)|(IE)]><td align="center" width="300" style="background-color: #5078bb;width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-50"
                              style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
                              <div
                                style="background-color: #5078bb;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div
                                  style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                  <!--<![endif]-->
            
                                  <table id="u_content_image_5" style="font-family:'Montserrat',sans-serif;" role="presentation"
                                    cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:25px 10px 60px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                              <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
            
                                                <img align="center" border="0" src="https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/images/image-8.png" alt="image" title="image"
                                                  style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 70%;max-width: 196px;"
                                                  width="196" class="v-src-width v-src-max-width" />
            
                                              </td>
                                            </tr>
                                          </table>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <!--[if (!mso)&(!IE)]><!-->
                                </div><!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="300" style="background-color: #5078bb;width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-50"
                              style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
                              <div
                                style="background-color: #5078bb;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div
                                  style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                  <!--<![endif]-->
            
                                  <table id="u_content_text_4" style="font-family:'Montserrat',sans-serif;" role="presentation"
                                    cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:35px 20px 0px 10px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <div class="v-text-align v-font-size"
                                            style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="font-size: 14px; line-height: 140%;"><span
                                                style="font-size: 18px; line-height: 25.2px;"><strong>PROTECT ALL YOUR DEVICE WITH
                                                  ANTIVIRUS</strong></span></p>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table id="u_content_text_9" style="font-family:'Montserrat',sans-serif;" role="presentation"
                                    cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:8px 20px 10px 10px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <div class="v-text-align v-font-size"
                                            style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="font-size: 14px; line-height: 140%;">Enhance Device Security: Safeguard Your Tech with Cybersecurity Measures. Your Digital Safety Matters to Us!</p>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <!--[if (!mso)&(!IE)]><!-->
                                </div><!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                          </div>
                        </div>
                      </div>
            
                      <!--[if gte mso 9]>
                  </v:textbox></v:rect>
                </td>
                </tr>
                </table>
                <![endif]-->
            
            
            
            
            
                      <div class="u-row-container v-row-padding--vertical" style="padding: 40px 0px 10px;background-color: #ffffff">
                        <div class="u-row"
                          style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                          <div
                            style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 40px 0px 10px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
            
                            <!--[if (mso)|(IE)]><td align="center" width="300" style="width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-50"
                              style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
                              <div
                                style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div
                                  style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                  <!--<![endif]-->
            
                                  <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0"
                                    cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                              <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
            
                                                <img align="center" border="0" src="https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/images/image-6.png" alt="image" title="image"
                                                  style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 33%;max-width: 92.4px;"
                                                  width="92.4" class="v-src-width v-src-max-width" />
            
                                              </td>
                                            </tr>
                                          </table>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0"
                                    cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <div class="v-text-align v-font-size"
                                            style="font-size: 14px; line-height: 130%; text-align: center; word-wrap: break-word;">
                                            <p style="line-height: 130%; font-size: 14px;"><span
                                                style="font-size: 18px; line-height: 23.4px;"><strong>CHECK YOUR</strong></span></p>
                                            <p style="line-height: 130%; font-size: 14px;"><span
                                                style="font-size: 18px; line-height: 23.4px;"><strong>PRIVACY
                                                  SETTING</strong></span></p>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table id="u_content_text_13" style="font-family:'Montserrat',sans-serif;" role="presentation"
                                    cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:5px 50px 10px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <div class="v-text-align v-font-size"
                                            style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                                            <p style="font-size: 14px; line-height: 140%;">Verify Your Settings for Enhanced Online Security. Your Personal Information Deserves Protection!</p>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <!--[if (!mso)&(!IE)]><!-->
                                </div><!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="300" style="width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-50"
                              style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
                              <div
                                style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div
                                  style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                  <!--<![endif]-->
            
                                  <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0"
                                    cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:12px 10px 13px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                              <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
            
                                                <img align="center" border="0" src="https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/images/image-11.png" alt="image" title="image"
                                                  style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 34%;max-width: 95.2px;"
                                                  width="95.2" class="v-src-width v-src-max-width" />
            
                                              </td>
                                            </tr>
                                          </table>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0"
                                    cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <div class="v-text-align v-font-size"
                                            style="font-size: 14px; line-height: 130%; text-align: center; word-wrap: break-word;">
                                            <p style="line-height: 130%; font-size: 14px;"><span
                                                style="font-size: 18px; line-height: 23.4px;"><strong>KEEP YOUR INFORMATION AND
                                                  PASSWORD PRIVATE</strong></span></p>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0"
                                    cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:5px 50px 30px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <div class="v-text-align v-font-size"
                                            style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                                            <p style="font-size: 14px; line-height: 140%;"> Maintain Privacy and Password Confidentiality. Your Information Security is Our Priority.</p>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <!--[if (!mso)&(!IE)]><!-->
                                </div><!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                          </div>
                        </div>
                      </div>
            
            
            
            
            
                      <!--[if gte mso 9]>
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;min-width: 320px;max-width: 600px;">
                    <tr>
                      <td background="%20" valign="top" width="100%">
                  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 600px;">
                    <v:fill type="frame" src="%20" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
                  <![endif]-->
            
                      <div id="u_row_2" class="u-row-container v-row-padding--vertical"
                        style="padding: 55px 0px 45px;background-color: #5078bb">
                        <div class="u-row"
                          style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                          <div
                            style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('%20');background-repeat: no-repeat;background-position: center top;background-color: transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 55px 0px 45px;background-color: #5078bb;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-image: url('%20');background-repeat: no-repeat;background-position: center top;background-color: transparent;"><![endif]-->
            
                            <!--[if (mso)|(IE)]><td align="center" width="300" style="width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-50"
                              style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
                              <div
                                style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div
                                  style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                  <!--<![endif]-->
            
                                  <table id="u_content_image_2" style="font-family:'Montserrat',sans-serif;" role="presentation"
                                    cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:22px 10px 0px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                              <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
            
                                                <img align="center" border="0" src="https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/images/image-7.png" alt="image" title="image"
                                                  style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 70%;max-width: 196px;"
                                                  width="196" class="v-src-width v-src-max-width" />
            
                                              </td>
                                            </tr>
                                          </table>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <!--[if (!mso)&(!IE)]><!-->
                                </div><!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="300" style="width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-50"
                              style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
                              <div
                                style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div
                                  style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                  <!--<![endif]-->
            
                                  <table id="u_content_text_2" style="font-family:'Montserrat',sans-serif;" role="presentation"
                                    cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:15px 20px 0px 10px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <div class="v-text-align v-font-size"
                                            style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="font-size: 14px; line-height: 140%;"><strong><span
                                                  style="font-size: 18px; line-height: 25.2px;">CHECK</span></strong></p>
                                            <p style="font-size: 14px; line-height: 140%;"><strong><span
                                                  style="font-size: 18px; line-height: 25.2px;">WEBSITE
                                                </span></strong><strong><span
                                                  style="font-size: 18px; line-height: 25.2px;">URL</span></strong></p>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table id="u_content_text_3" style="font-family:'Montserrat',sans-serif;" role="presentation"
                                    cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:8px 20px 10px 10px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <div class="v-text-align v-font-size"
                                            style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="font-size: 14px; line-height: 140%;">Ensure Secure Browsing by Reviewing Web Addresses. Your Online Safety is Paramount to Us.</p>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <!--[if (!mso)&(!IE)]><!-->
                                </div><!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                          </div>
                        </div>
                      </div>
            
                      <!--[if gte mso 9]>
                  </v:textbox></v:rect>
                </td>
                </tr>
                </table>
                <![endif]-->
            
            
            
            
            
                      <div class="u-row-container v-row-padding--vertical" style="padding: 0px;background-color: #ffffff">
                        <div class="u-row"
                          style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                          <div
                            style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
            
                            <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-100"
                              style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                              <div
                                style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div
                                  style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                  <!--<![endif]-->
            
                                  <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0"
                                    cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <div align="center">
                                            <div style="display: table; max-width:187px;">
                                              <!--[if (mso)|(IE)]><table width="187" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:187px;"><tr><![endif]-->
            
            
                                              <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
                                              <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32"
                                                style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px">
                                                <tbody>
                                                  <tr style="vertical-align: top">
                                                    <td align="left" valign="middle"
                                                      style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                      <a href="https://www.facebook.com/therichieclub" title="Facebook" target="_blank">
                                                        <img src="https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/images/image-1.png" alt="Facebook" title="Facebook" width="32"
                                                          style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                      </a>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <!--[if (mso)|(IE)]></td><![endif]-->
            
                                              <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
                                              <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32"
                                                style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px">
                                                <tbody>
                                                  <tr style="vertical-align: top">
                                                    <td align="left" valign="middle"
                                                      style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                      <a href="https://twitter.com/i/flow/login?redirect_after_login=%2Ftherichieclub" title="Twitter" target="_blank">
                                                        <img src="https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/images/image-3.png" alt="Twitter" title="Twitter" width="32"
                                                          style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                      </a>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <!--[if (mso)|(IE)]></td><![endif]-->
            
                                              <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
                                              <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32"
                                                style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px">
                                                <tbody>
                                                  <tr style="vertical-align: top">
                                                    <td align="left" valign="middle"
                                                      style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                      <a href="https://www.linkedin.com/company/richieclub/" title="LinkedIn" target="_blank">
                                                        <img src="https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/images/image-4.png" alt="LinkedIn" title="LinkedIn" width="32"
                                                          style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                      </a>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <!--[if (mso)|(IE)]></td><![endif]-->
            
                                              <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
                                              <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32"
                                                style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                                                <tbody>
                                                  <tr style="vertical-align: top">
                                                    <td align="left" valign="middle"
                                                      style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                      <a href="https://www.instagram.com/therichie.club/" title="Instagram" target="_blank">
                                                        <img src="https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/images/image-2.png" alt="Instagram" title="Instagram" width="32"
                                                          style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                      </a>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <!--[if (mso)|(IE)]></td><![endif]-->
            
            
                                              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                            </div>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0"
                                    cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td class="v-container-padding-padding"
                                          style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 30px;font-family:'Montserrat',sans-serif;"
                                          align="left">
            
                                          <div class="v-text-align v-font-size"
                                            style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                                            <p style="font-size: 14px; line-height: 140%;">Chase Alpha Technologies Private Limited ,
                                              303, Town Center 1,Marol, Andheri East, Mumbai - 400059</p>
                                            <p style="font-size: 14px; line-height: 140%;">All rights reserved.
                                            </p>
                                            <p style="font-size: 14px; line-height: 140%;"> </p>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <!--[if (!mso)&(!IE)]><!-->
                                </div><!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                          </div>
                        </div>
                      </div>
            
            
            
                      <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></div><![endif]-->
              <!--[if IE]></div><![endif]-->
            </body>
            
            </html>
    
                        `,
      text:'hi this is test',
      attachments: [
        {
          filename: 'Attachment 1-Video links topic wise.docx',
          path: 'https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/email-attachment/Attachment+1-Video+links+topic+wise.docx',
        },
        {
          filename: 'DATA SECURITY AND PRIVACY.pdf',
          path: 'https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/email-attachment/DATA+SECURITY+AND+PRIVACY.pdf',
        },
        {
          filename: 'EMAIL SEC.pdf',
          path: 'https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/email-attachment/EMAIL+SEC.pdf',
        },
        {
          filename: 'FINANCIAL SERVICES SECURITY.pdf',
          path: 'https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/email-attachment/FINANCIAL+SERVICES+SECURITY.pdf',
        },
        {
          filename: 'INFORMATION COMMUNICATION TECHNOLOGY.pdf',
          path: 'https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/email-attachment/INFORMATION+COMMUNICATION+TECHNOLOGY.pdf',
        },
        {
          filename: 'INTERNET SERVICES.pdf',
          path: 'https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/email-attachment/INTERNET+SERVICES.pdf',
        },
        {
          filename: 'MOBILE SECURITY.pdf',
          path: 'https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/email-attachment/MOBILE+SECURITY.pdf',
        },
        {
          filename: 'SOCIAL MEDIA.pdf',
          path: 'https://richiestorage.s3.ap-south-1.amazonaws.com/email-template/email-attachment/SOCIAL+MEDIA.pdf',
        },
      ],
    }
    const response =  await transporter.sendMail(mailOptions);
    res.push ({email:email[i],msgid:response.response})
    console.log(response.response)
  }
  return res
};

module.exports = {
  triggerOTP,
  triggerEmail,
  triggerEmailInvoice,
  triggerEmailForSecurityUpdate
};
