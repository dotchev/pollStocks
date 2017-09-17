'use strict';

const AWS = require('aws-sdk');
const ses = new AWS.SES({ apiVersion: '2010-12-01' });
const debug = require('debug')('stocks:mail');

module.exports = sendMail;

function sendMail(options, report, cb) {
  if (!report) {
    console.log('No alerts, no mail');
    return cb();
  }

  console.log('Sending mail from %s to %s with subject "%s"',
    options.from, options.to, report.subject);
  var params = {
    Destination: {
      ToAddresses: [options.to]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: report.html
        },
        Text: {
          Charset: "UTF-8",
          Data: report.text
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: report.subject
      }
    },
    Source: options.from,
  };
  debug('Send mail');
  ses.sendEmail(params, (err, result) => {
    debug('Mail result:', err, result);
    cb(err);
  });
}
