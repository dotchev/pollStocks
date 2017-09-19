'use strict';

const debug = require('debug')('stocks:filter');

module.exports = filterStocks;

function filterStocks(options, data) {
  debug('options:', options);
  let result = [];
  for (let stock of data) {
    let alerts = new Set();
    let sma50p = percent(stock.price, stock.sma50d);
    let sma200p = percent(stock.price, stock.sma200d);
    let hi52p = percent(stock.price, stock.hi52w);

    options.max_sma50p &&
      isFinite(sma50p) &&
      Math.abs(sma50p) >= options.max_sma50p &&
      alerts.add('sma50p');

    options.min_sma200p &&
      isFinite(sma200p) &&
      sma200p < options.min_sma200p &&
      alerts.add('sma200p');

    options.min_hi52p &&
      isFinite(hi52p) &&
      hi52p <= options.min_hi52p &&
      alerts.add('hi52p');

    if (alerts.size > 0) {
      result.push({
        alerts,
        name: stock.name,
        symbol: stock.symbol,
        price: stock.price,
        sma50p,
        sma200p,
        hi52p
      });
    }
  }
  debug('result:', result);
  return result;
}

function percent(a, b) {
  return Math.round((a / b - 1) * 100);
}