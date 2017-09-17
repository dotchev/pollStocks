'use strict';

const debug = require('debug')('stocks:fetch');

module.exports = fetchStocks;

function fetchStocks(symbols, cb) {
  const parse = require('csv-parse/lib/sync');
  const request = require('request');
  const qs = require('querystring');

  const url = 'http://download.finance.yahoo.com/d/quotes.csv?' +
    qs.stringify({
      s: symbols,
      f: 'nsl1m3m4jk'
    });
  const columns = [
    'name',
    'symbol',
    'price',
    'sma50d',
    'sma200d',
    'lo52w',
    'hi52w'
  ];
  debug('Fetching %s ...', url);
  request(url, (err, res, body) => {
    if (err) return cb(err);
    if (res.statusCode !== 200) {
      return cb(new Error(`${url} returned status ${res.statusCode}`));
    }
    debug('Body:\n%s', body);
    let data = parse(body, { columns, auto_parse: true });
    debug('Data:\n%O', data);
    cb(null, data);
  });
}

