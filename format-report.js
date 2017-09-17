'use strict';

module.exports = formatReport;

function formatReport(alerts) {
  if (alerts.length === 0) {
    return null;
  }
  let subject = 'Stock alert: ' + alerts.map(s => s.symbol).join(', ');
  return {
    subject,
    text: formatText(alerts),
    html: formatHtml(alerts)
  };
}

function formatText(alerts) {
  return JSON.stringify(alerts, null, 2);
}


function formatHtml(alerts) {
  const tdstyle = 'padding: 5px';
  let report = `
    <table style="border-collapse: collapse; border-spacing: 0px">
      <tr style="background-color: #68f">
        <th style="${tdstyle}">Name</th>
        <th style="${tdstyle}">Symbol</th>
        <th style="${tdstyle}">Price</th>
        <th style="${tdstyle}">Price / SMA 50d</th>
        <th style="${tdstyle}">Price / SMA 200d</th>
        <th style="${tdstyle}">Price / 52w high</th>
      </tr>`;
  let colors = ['#acf', '#8af'];
  let colorIdx = 0;
  for (let stock of alerts) {
    function nstyle(tag) {
      return `style="${tdstyle}; text-align: right`
        + (stock.alerts.has(tag) ? '; color: red' : '')
        + '"';
    }

    report += `
      <tr style="background-color: ${colors[colorIdx++ % 2]}">
        <td style="${tdstyle}">${stock.name}</td>
        <td style="${tdstyle}">
          <a href="https://finance.yahoo.com/quote/${stock.symbol}">
            ${stock.symbol}
          </a>
        </td>
        <td ${nstyle()}>${stock.price}</td>
        <td ${nstyle('sma50p')}>${percent(stock.sma50p)}</td>
        <td ${nstyle('sma200p')}>${percent(stock.sma200p)}</td>
        <td ${nstyle('hi52p')}>${percent(stock.hi52p)}</td>
      </tr>`;
  }
  report += '</table>';
  return report;

}


function percent(num) {
  return `${num > 0 ? '+' : ''}${num}%`;
}
