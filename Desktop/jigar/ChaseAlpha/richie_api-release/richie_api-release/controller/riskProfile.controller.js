const RiskProfileModel = require('../model/riskProfile.model');
const _ = require('lodash');
const UserModel = require('../model/user.model');
const riskScores = require('../data/self_risk.json');
const RiskQandA = require('../model/riskQandA.model')

const getAllRiskProfileQuestions = async (req, res, next) => {
  try {
    RiskProfileModel.find({}, { _id: 0, __v: 0 }, function (err, result) {
      if (err) {
        return res.status(500).json({
          success: false,
          message:
            "Something went wrong, couldn't get all the risk profiling questions",
        });
      } else {
        return res.status(200).json({ success: true, data: result });
      }
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const updateRiskProfileScoreCard = async (req, res, next) => {
  try {
    let newScoreCard = req.body.scoreCard;
    const opts = { new: true, upsert: true };

    if (
      !_.isUndefined(newScoreCard) &&
      newScoreCard.scoreCardTitle &&
      newScoreCard.options
    ) {
      if (newScoreCard.options.length < 2) {
        return res.status(422).json({
          success: false,
          message:
            'Please give required Scorecard details with atleast 2 options',
        });
      }
      for (option of newScoreCard.options) {
        if (
          option.optionName &&
          option.optionValueMin &&
          option.optionValueMax &&
          _.isNumber(option.optionValueMin) &&
          _.isNumber(option.optionValueMax)
        ) {
          continue;
        } else {
          return res.status(422).json({
            success: false,
            message:
              'Please provide all required options fields with correct types in Scorecard details',
          });
        }
      }
      RiskProfileModel.findOneAndUpdate(
        {},
        { scoreCard: newScoreCard },
        opts,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Couldn't update the risk profiling scorecard",
            });
          } else {
            return res
              .status(201)
              .json({
                success: true,
                message: 'Scorecard is updated for Risk profile',
              });
          }
        }
      );
    } else {
      return res
        .status(422)
        .json({
          success: false,
          message: 'Please give required Scorecard details',
        });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const addRiskProfileQuestion = async (req, res, next) => {
  const newQuestion = req.body.question;

  try {
    const opts = { new: true, upsert: true };
    if (
      !_.isUndefined(newQuestion) &&
      newQuestion?.questionDescription &&
      newQuestion?.options
    ) {
      if (newQuestion.options.length < 2) {
        return res.status(422).json({
          success: false,
          message:
            'Please give required question details with atleast 2 options',
        });
      }
      if (
        newQuestion.questionDisabled &&
        !_.isBoolean(newQuestion.questionDisabled)
      ) {
        return res.status(422).json({
          success: false,
          message:
            'Please provide questionDisabled field as boolean in question details',
        });
      }
      for (option of newQuestion.options) {
        if (option.optionName && _.isNumber(option.optionValue)) {
          continue;
        } else {
          return res.status(422).json({
            success: false,
            message:
              'Please provide both option name and value(in number) in question details',
          });
        }
      }
      RiskProfileModel.findOneAndUpdate(
        {},
        {
          $push: {
            questions: newQuestion,
          },
        },
        opts,
        function (err, result) {
          if (err) {
            return res.status(500).json({
              message:
                'Something went wrong, couldnt create new question for risk profile',
            });
          } else {
            return res.status(201).json({
              success: true,
              message: 'New question is created for risk profile',
            });
          }
        }
      );
    } else {
      return res
        .status(422)
        .json({
          success: false,
          message: 'Please give required question details',
        });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const updateRiskProfileQuestion = async (req, res, next) => {
  try {
    let questionId = req.params.questionId;
    const newQuestion = req.body.question;

    // check if question exists
    const result = await RiskProfileModel.find({});
    let questionExists = false;
    if (result[0]?.questions) {
      // check for types and required fields in options
      for (const question of result[0].questions) {
        if (question.questionId === questionId) {
          questionExists = true;
        }
      }
    } else {
      return res
        .status(404)
        .json({
          success: false,
          message: `No document found with questionId: ${questionId}`,
        });
    }
    if (!questionExists) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No document found withh questionId: ${questionId}`,
        });
    }
    // check for required fields
    if (
      !_.isUndefined(newQuestion) &&
      newQuestion.questionDescription &&
      newQuestion.options
    ) {
      // atleast 2 options
      if (newQuestion?.options?.length < 2) {
        return res.status(422).json({
          success: false,
          message:
            'Please give required question details with atleast 2 options',
        });
      }
      // check questionDisabled is boolean
      if (
        newQuestion.questionDisabled &&
        !_.isBoolean(newQuestion.questionDisabled)
      ) {
        return res.status(422).json({
          success: false,
          message:
            'Please provide question Disabled field as boolean in question details',
        });
      }
      // check for types and required fields in options
      for (option of newQuestion.options) {
        if (option.optionName && _.isNumber(option.optionValue)) {
          continue;
        } else {
          return res.status(422).json({
            success: false,
            message:
              'Please provide both option name and value(in number) in question details',
          });
        }
      }
      newQuestion.questionId = questionId;
      RiskProfileModel.updateOne(
        { 'questions.questionId': questionId },
        { $set: { 'questions.$': newQuestion } },
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message:
                "Something went wrong, couldn't update the risk profiling question",
            });
          } else {
            return res
              .status(201)
              .json({
                success: true,
                message: 'Question is updated for risk profile',
              });
          }
        }
      );
    } else {
      return res
        .status(422)
        .json({
          success: false,
          message: 'Please give required question details',
        });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const deleteRiskProfileQuestion = async (req, res, next) => {
  let questionId = req.params.questionId;
  try {
    if (questionId) {
      // check if question exists
      const result = await RiskProfileModel.find({});
      let questionExists = false;
      if (!_.isEmpty(result) && !_.isEmpty(result[0]?.questions)) {
        // check for types and required fields in options
        for (const question of result[0].questions) {
          if (question.questionId === questionId) {
            questionExists = true;
          }
        }
      } else {
        return res.status(404).json({
          success: false,
          message: `No document found with questionId: ${questionId}`,
        });
      }
      if (!questionExists) {
        return res.status(404).json({
          success: false,
          message: `No document found withh questionId: ${questionId}`,
        });
      }

      RiskProfileModel.findOneAndUpdate(
        { 'questions.questionId': questionId },
        { $pull: { questions: { questionId: questionId } } },
        function (err, result) {
          if (err) {
            return res.status(500).json({
              success: false,
              message:
                "Something went wrong, couldn't remove the risk profiling question",
            });
          } else {
            return res
              .status(201)
              .json({
                success: true,
                message: 'Question is removed from risk profile',
              });
          }
        }
      );
    } else {
      return res.status(500).json({
        success: false,
        message:
          'Please provide question id to delete the existing question in the risk profile',
      });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const getScoreCardUserResponse = async (req, res, next) => {
  const scoreOptionId = req.body.scoreOptionId;
  const user = res.locals.user;
  let score = 0;
  try {
    const result = await RiskProfileModel.findOne({});
    if (result?.scoreCard) {
      const scoreCardOptions = result.scoreCard.options;
      for (const option of scoreCardOptions) {
        if (option.scoreOptionId === scoreOptionId) {
          score =
            Math.floor(
              Math.random() *
                (option.optionValueMax - option.optionValueMin + 1)
            ) + option.optionValueMin;
        }
      }
      await UserModel.updateOne({ _id: user._id }, { $set: { score: score } });
      return res.status(200).json({
        success: true,
        score: score,
      });
    }
    return res.status(500).json({
      success: false,
      message:
        'Something went wrong, make sure to provide correct scorecardId to get the risk profile score',
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const getQuestionsUserResponse = async (req, res, next) => {
  /*  answers:[{
            questionId: "",
            optionId: ""
        },
        {
            questionId: "",
            optionId: ""
        }]*/
  let total = 0;
  let scoreName = '';
  let scoreDescription = '';
  const user = res.locals.user;
  try {
    const answers = req.body.answers; 
    const result = await RiskProfileModel.findOne({});
    // check there is data in risk profile
    if (!_.isEmpty(result)) {
      if (result?.questions?.length) {
        const selectedIds = _.map(
          answers,
          (answerSelected) => answerSelected.optionId
        );
        const questionIds = _.map(
          answers,
          (answerSelected) => answerSelected.questionId
        );
        const questionDescription = _.map(
          result.questions,
          (answerSelected) => answerSelected.questionDescription
        ); // question that user has answered
         const answerOptions = _.map(
          result.questions,
          (answerSelected) => answerSelected.options
        ); // answer that user has responded
        const selectedAns = selectedIds.map(item=>answerOptions.flat(2).filter(value=>value.optionId === item)).flat(2).map(x=>x.optionName) // filtering answered value
        const Scores= selectedIds.map(item=>answerOptions.flat(2).filter(value=>value.optionId === item)).flat(2).map(x=>x.optionValue) // filtering Scores in array
        const questions = result.questions; 
        for (let question of questions) {
          if (questionIds.includes(question.questionId)) {
            for (const option of question.options) {
              if (selectedIds.includes(option.optionId)) {
                total += option.optionValue;
              }
            }
          }
        }
        let QueAndAnsobj=[]
         for(let i=0;i<questionDescription.length;i++){
          QueAndAnsobj.push({[questionDescription[i]]:selectedAns[i]})
         } 
         const riskQandA =  new RiskQandA({
          userId:user._id,
          name:user.name,
          email:user.email,
          response:QueAndAnsobj,
          scores:Scores,
          totalScores:total
         })
         riskQandA.save()
        await UserModel.updateOne(
          { _id: user._id },
          {
          $push: {
            riskTest: riskQandA._id,
          },
          $set: { score: total }
          },
        );

        riskScores.map((item) => {
          if (item.low <= total && item.high >= total) {
            scoreName = item.name;
            scoreDescription = item.description;
          }
        });
        if (scoreName && scoreDescription) {
          return res.status(200).json({
            success: true,
            score: total,
            scoreName: scoreName,
            scoreDescription: scoreDescription,
          });      
        }
      }
    }
    return res.status(500).json({
      success: false,
      message:
        'Something went wrong, make sure optionIds and questionIds are provided to get the risk profile score',
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const mapQuestionAndResponseOnScore =async(req,res,next)=>{
   try{ 
   const result = await RiskProfileModel.findOne({});
   let mappedScores
   let ScoreResponse= createResposneforRiskScore()
    const users = await UserModel.find({},'_id name email score')
    let response
    const updatedRiskscore = users.map(async(scores)=>{
      if(scores.score && scores.riskTest.length===0){
        mappedScores = ScoreResponse.find((score)=>+Object.keys(score) === scores.score) 
        // console.log(res);
        // const responsevalue = res[0][scores.score].map((optionId)=>{
        //    const resvalue = result.questions.map((optionvalue)=>{
        //     const optionID = optionvalue.options.filter((optionvalue)=>optionvalue.optionValue === optionId)
        //      return {
        //       questionId:optionvalue.questionId,
        //       optionId:optionID[0].optionId
        //     }
        //   })
        //   return resvalue
        // })
        response = result.questions.map((res,i)=>{
          const optionvalue = mappedScores[scores.score][i]
          const answer = res.options.filter((x)=>x.optionValue === optionvalue)
          return {
            [res.questionDescription]:answer[0].optionName
          }
        })
          try{
          const riskQandA =  new RiskQandA({
          userId:scores._id,
          name:scores.name,
          email:scores.email,
          response:response,
          scores:mappedScores[scores.score],
          totalScores:scores.score
         })
         riskQandA.save()
          await UserModel.updateOne(
          { _id: scores._id },
          {
          $push: {
            riskTest: riskQandA._id,
          },
          $set: { score: scores.score }
          },
        );
        return 'risk score updated'
         
         }catch(e){
          console.log(e);
          return res.status(500).send({message:'something went wrong'})
         }
      }
      
       
    })
   if(updatedRiskscore.length >0){
    return res.status(200).send({message:'all the risk scores updated'})
   }
  }catch(e){
    console.log(e);
   }
}

const createResposneforRiskScore =()=>{
  function generateArrayWithSum(score) {
  const arrayLength = 7;
  const numbers = [];

  // loop until the sum of the array equals the score
  let sum = 0;
  while (sum !== score) {
    // clear the array
    numbers.length = 0;
    // generate 7 random numbers between 1 and 4
    for (let i = 0; i < arrayLength; i++) {
      const num = Math.floor(Math.random() * 3) + 1;
      numbers.push(num);
    }
    // calculate the sum of the array
    sum = numbers.reduce((a, b) => a + b, 0);
  }
  return numbers;
}

// Example usage
let response = [];
for (let i = 9; i < 22; i++) {
  const numbers = generateArrayWithSum(i);
  response.push({
    [i]: numbers
  });
}
return response
} 
module.exports = {
  getAllRiskProfileQuestions,
  updateRiskProfileScoreCard,
  addRiskProfileQuestion,
  updateRiskProfileQuestion,
  deleteRiskProfileQuestion,
  getScoreCardUserResponse,
  getQuestionsUserResponse,
  mapQuestionAndResponseOnScore
};
