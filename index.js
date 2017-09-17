'use strict';

const debug = require('debug')('stocks:handler');

const async = require('async');
const fetch = require('./fetch-stocks');
const filter = require('./filter-stocks');
const format = require('./format-report');
const send = require('./send-mail');

exports.handler = (event, context, callback) => {
  async.waterfall([
    fetch.bind(null, process.env.SYMBOLS),
    async.asyncify(filter.bind(null, {
      max_sma50p: process.env.MAX_SMA50P,
      min_sma200p: process.env.MIN_SMA200P,
      min_hi52p: process.env.MIN_HI52P
    })),
    async.asyncify(format),
    send.bind(null, {
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO
    })
  ], callback);
};


