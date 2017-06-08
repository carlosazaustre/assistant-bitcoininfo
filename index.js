'use strict';

process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').ApiAiAssistant;
const request = require('request');

// Variables we will use
const ACTION_PRICE = 'price';
const ACTION_TOTAL = 'total';
const EXT_BITCOIN_API_URL = 'https://blockchain.info';
const EXT_PRICE = '/q/24hrprice';
const EXT_TOTAL = '/q/totalbtc';

exports.bitcoinInfo = (req, res) => {
  const assistant = new Assistant({ request: req, response: res });
  console.log('bitcoinInfoAction Request headers: ' + JSON.stringify(req.headers));
  console.log('bitcoinInfoAction Request body: ' + JSON.stringify(req.body));

  // Fulfill price action business logic
  function priceHandler (assistant) {
    request(EXT_BITCOIN_API_URL + EXT_PRICE, (error, response, body) => {
      console.log('priceHandler response: ' + JSON.stringify(response) + 'Body: ' + body + ' | Error: ' + error);
      const msg = 'Right now the price of a bitcoin is ' + body + ' USD';
      assistant.tell(msg);
    });
  }

  // Fulfill total bitcoin action
  function totalHandler (assistant) {
    request(EXT_BITCOIN_API_URL + EXT_TOTAL, (error, response, body) => {
      console.log('totalHandler response: ' + JSON.stringify(response) + ' Body: ' + body + ' | Error: ' + error);
      const billionsBitcoins = body / 1000000000;
      const msg = 'Right now there are ' + billionsBitcoins + ' billion bitcoins around the world';
      assistant.tell(msg);
    });
  }

  // Entry poiny to all our actions
  const actionMap = new Map();
  actionMap.set(ACTION_PRICE, priceHandler);
  actionMap.set(ACTION_TOTAL, totalHandler);

  assistant.handleRequest(actionMap);
}
