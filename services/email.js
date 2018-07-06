'use strict';

const mailsender = require('mailsender');
const {CONFIRMATION_LINK_BASE_URL, EMAIL_SECRET} = process.env;

async function sendConfirmationEmail (toAddress, hmac, data) {
  try {
    const emailConfirm = CONFIRMATION_LINK_BASE_URL + '?hash=' + hmac + '&email=' + toAddress;

    const options = {
      subject: 'Confirm your registration',
      from: EMAIL_SECRET,
      password: '123asdASD.',
      to: toAddress
    };

    data.link = encodeURI(emailConfirm);

    await sendEmail(options, data);
  } catch (err) {
    throw new Error();
  }
}

async function sendEmail (option, data) {
  mailsender
    .from(option.from, option.password)
    .to('jjovanovic24@hotmail.com')
    .body('subject', 'Link : ' + data.link)
    .send();
}

module.exports = {
  sendConfirmationEmail
};
