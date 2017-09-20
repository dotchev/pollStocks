'use strict';

const debug = require('debug')('stocks:fetch');

module.exports = fetchStocks;

function fetchStocks(symbols, cb) {
  const parse = require('csv-parse/lib/sync');
  const request = require('request');

  const fields = {
    name: 'n',
    symbol: 's',
    price: 'l1',
    sma50d: 'm3',
    sma200d: 'm4',
    lo52w: 'j',
    hi52w: 'k'
  };
  const columns = Object.keys(fields);
  const url = 'http://download.finance.yahoo.com/d/quotes.csv';
  const qs = {
    s: symbols,
    f: columns.map(c => fields[c]).join('')
  };
  debug('Fetching %s query %o', url, qs);
  request({ url, qs }, (err, res, body) => {
    if (err) return cb(err);
    debug('Status: %s', res.statusCode);
    debug('Body:\n%s', body);
    if (res.statusCode !== 200) {
      return cb(new Error(`${url} returned status ${res.statusCode}`));
    }
    let data = parse(body, { columns, auto_parse: true });
    debug('Data:\n%O', data);
    cb(null, data);
  });
}

