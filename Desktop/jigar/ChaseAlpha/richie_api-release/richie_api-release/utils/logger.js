const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECERT_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const logger = new winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      timestamp: true,
      colorize: true,
    })
    // new winston.transports.File({filename:'invoice.log',level:'info'})
  ],
});

const cloudwatchConfig = {
  cloudWatchLogs: new AWS.CloudWatchLogs(),
  logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
  logStreamName: `${process.env.CLOUDWATCH_GROUP_NAME}-${process.env.NODE_ENV}`,
  messageFormatter: ({ level, message, additionalInfo }) =>
    `[${level}] : ${message} \n${
      additionalInfo && `Additional Info: ${JSON.stringify(additionalInfo)}`
    }}`,
};

if (process.env.NODE_ENV !== 'local') {
  logger.add(new WinstonCloudWatch(cloudwatchConfig));
}

module.exports = logger;
