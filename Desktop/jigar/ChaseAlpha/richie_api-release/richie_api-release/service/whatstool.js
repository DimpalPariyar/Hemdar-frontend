const axios = require("axios");
const whatsappMsgModel = require("../model/whatsappMsg.model");
const whatsappResponseModel = require("../model/whatsappResponse.model");
require("dotenv").config();
const WHATSAPP_API_NO = process.env.WHATSAPP_API_NO
const baseUrl = `https://api.whatstool.business/developers/v1/messages/${WHATSAPP_API_NO}`;
const authkey = process.env.WHATSAPP_AUTHKEY;

const TemplateSelector = (number,message) =>{
    let equitytemplate
    const createAdviceTemplate = {
      id: "874274953892773888",
      namespace: "d142b3c4_14f0_4c95_9518_b2f58159c14c",
      language: {
        code: "en_US",
      },
      name: "new_trade",
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: `${number?.name?.toLowerCase().split(" ").map(
              (word) => word.charAt(0)?.toUpperCase() + word?.slice(1)
            )
            .join(" ").split(' ')[0]}` },
            { type: "text", text: `${message.action}` },
            { type: "text", text: `${message.underlying}` },
            { type: "text", text: `${message.entry}` },
            { type: "text", text: `${message.stoploss}` },
            { type: "text", text: `${message.target}` },
          ],
        },
      ],
    };
   if(message.instrument === 'EQ'){
    equitytemplate = createAdviceTemplate
    if(message.update){
      equitytemplate = {
        id: "871706884112695296",
        namespace: "d142b3c4_14f0_4c95_9518_b2f58159c14c",
        language: {
          code: "en_US",
        },
        name: "update_equity",
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: `${message.underlying}` },
              { type: "text", text: `${message.body}` },
              { type: "text", text: `${message.entry}` },
              { type: "text", text: `${message.date}` },
              { type: "text", text: `${message.cmp}` },
              { type: "text", text: `${message.return}` },
              { type: "text", text: `${message.status}` },
              { type: "text", text: `${message.tradestatus}` },
            ],
          },
        ],
      };
    }
    return equitytemplate
   }
   if (
     message.instrument === "OPTIDX" ||
     message.instrument === "OPTSTK" ||
     message.instrument === "FUTSTK" ||
     message.instrument === "FUTIDX" ||
     message.instrument === "FUTCOM"
   ) {
     let optiontemplate;
    optiontemplate=createAdviceTemplate
     if (message.update) {
       optiontemplate = {
         id: "872062784164507648",
         namespace: "d142b3c4_14f0_4c95_9518_b2f58159c14c",
         language: {
           code: "en_US",
         },
         name: "trade_update_option",
         components: [
           {
             type: "body",
             parameters: [
               { type: "text", text: `${message.underlying}` },
               { type: "text", text: `${message.body}` },
               { type: "text", text: `${message.entry}` },
               { type: "text", text: `${message.lotsize}` },
               { type: "text", text: `${message.date}` },
               { type: "text", text: `${message.cmp}` },
               { type: "text", text: `${message.status}` },
               { type: "text", text: `${message.tradestatus}` },
             ],
           },
         ],
       };
     }
     return optiontemplate;
   }
}

async function SendTemplateWhatsappMessage(numbers, message) {
  const promises = [];
  // let finalresponse 
  for (const number of numbers) {
        let data = JSON.stringify({
          to: `${number.number}`,
          type: "template",
          template: TemplateSelector(number,message)
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: baseUrl,
            headers: { 
              'x-api-key': `${authkey}`, 
              'Accept': 'application/json', 
              'Content-Type': 'application/json'
            },
            data : data
          };
          const promise = axios.request(config);
          promises.push(promise);
        }
        try {
            const responses = await Promise.allSettled(promises);
            // finalresponse = responses.map((data,index)=>{return {res :data?.value?.data,user:numbers[index]}})
            // const filterfailedwhatsappmsg  = responses.filter(data =>data.res === undefined)
   

            // commmented on 7th nov 2023
            // const failedPromises = responses.filter((result) => result.status === 'rejected');
            // if(failedPromises.length >0){
            //   let retryresponses
            //   // let mappingindex = failedPromises.length
            //   for(let i = 0 ; i<3 ; i++){
            //      retryresponses = await Promise.allSettled(failedPromises)
            //      const retryfailedpromise = retryresponses.filter((result) => result.status === 'rejected');
            //      if(retryfailedpromise.length === 0){
            //       break;
            //      }
            //   }

            // Filter out failed promises that don't have the 'res' object
    const failedPromises = responses.filter((result) =>  result.status === 'rejected' && !result.reason?.response?.data?.res );
    // console.log(failedPromises[0].reason.response,responses.length,numbers)
    if (failedPromises.length > 0) {
      for (let retryCount = 0; retryCount < 3; retryCount++) {
        // Retry the failed promises
        const retryResponses = await Promise.allSettled(failedPromises.map((failedPromise) => {
          const { number } = numbers[promises.indexOf(failedPromise)];
          return axios.request({
            ...config,
            data: JSON.stringify({
              to: number.number,
              type: "template",
              template: TemplateSelector(number, message),
            })
          });
        }));

        // Filter out failed promises that still don't have the 'res' object
        failedPromises = retryResponses.filter((result) => result.status === 'rejected' && !result?.res);
        if (failedPromises.length === 0) {
          break; // No more retries needed
        }
      }
    }
              // for(let i = 0 ; i < mappingindex ; i++){
              //   finalresponse=finalresponse.map((data,index)=>{
              //     if(!data.res){
              //       data.res= retryresponses[i]
              //       mappingindex++
              //     }
              //     return data})
              //   }
            // }
            const insertManyWhatsapp = responses.map((data,index) => {
              const templateid = TemplateSelector(numbers[index].number,message)
              return {
                messagebody: `
                 ${numbers[index].name?`${numbers[index]?.name?.toLowerCase().split(" ").map(
                    (word) => word.charAt(0)?.toUpperCase() + word?.slice(1)
                  )
                  .join(" ").split(' ')[0]}`:''},
                  ${message?.action?message?.action:''} 
                  ${message?.body?message?.body:''} 
                  ${message?.lotsize?message?.lotsize:''}
                  ${message?.date?message?.date:''}
                  ${message?.cmp?message?.cmp:''} 
                  ${message?.underlying?message?.underlying:''} 
                  ${message?.expiry?message?.expiry:''} 
                  ${message?.strike?message?.strike:''}
                  ${message?.optiontype?message?.optiontype:''} 
                  ${message?.entry?message?.entry:''} 
                  ${message?.stoploss?message?.stoploss:''} 
                  ${message?.target?message?.target:''} 
                  ${message?.status?message?.status:''}
              `,
                templateId:templateid.id,
                templateName:templateid.name,
                usermobile: numbers[index].number,
                userId: numbers[index].id,
                responses:data?.value?.data
              };
            });
            await whatsappMsgModel.insertMany(insertManyWhatsapp);
            await whatsappResponseModel.create({
              messagebody: `
                  ${message?.action?message?.action:''} 
                  ${message?.body?message?.body:''} 
                  ${message?.lotsize?message?.lotsize:''}
                  ${message?.date?message?.date:''}
                  ${message?.cmp?message?.cmp:''} 
                  ${message?.underlying?message?.underlying:''} 
                  ${message?.expiry?message?.expiry:''} 
                  ${message?.strike?message?.strike:''}
                  ${message?.optiontype?message?.optiontype:''} 
                  ${message?.entry?message?.entry:''} 
                  ${message?.stoploss?message?.stoploss:''} 
                  ${message?.target?message?.target:''} 
                  ${message?.status?message?.status:''}
              `,
              responses:responses.map((data,index)=>{return {res :data?.value?.data,user:numbers[index]}})

            })
            return responses
          } catch (error) {
            console.error(`Error sending messages: ${error.message}`);
          }
        // const response = await axios.request(config)
        // console.log(`Message sent to ${number}: ${response.data}`);
  }


  async function SendOnetoOneWhatsappMessage(number,message){
    try {
      let data = JSON.stringify({
        "recipient_type": "individual",
        "to": number,
        "type": "text",
        "text": {
          "body": message
        }
      });
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: baseUrl,
        headers: { 
          'x-api-key': `${authkey}`, 
          'Accept': 'application/json', 
          'Content-Type': 'application/json'
        },
        data : data
      };
     const response =  await axios.request(config)
     return response
      
    } catch (error) {
      console.log(error)
    }
  }
module.exports ={
  SendTemplateWhatsappMessage,
  SendOnetoOneWhatsappMessage
}

