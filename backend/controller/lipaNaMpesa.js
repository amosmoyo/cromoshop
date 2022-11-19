const asyncHandler = require("express-async-handler");
const unirest = require('unirest')

const daraja = require("../model/daraja")

exports.setAccessToken = asyncHandler(async (req, res, next) => {
  console.log(req.access_token, 1111);
  res.json({
    access_token: req.access_token,
  });
});

exports.stk = asyncHandler(async (req, res) => {
  const phone = req.body.phone.substring(1);
  const amount = req.body.amount;
  let auth = req.access_token;

  const paybill = process.env.paybill;

  let date = new Date();

  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  const password = new Buffer.from(
    paybill + process.env.pass_key + timestamp
  ).toString("base64");

  let reqq = unirest(
    "POST",
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
  )
    .headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth,
    })
    .send(
      JSON.stringify({
        BusinessShortCode: paybill,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: `254${phone}`,
        PartyB: paybill,
        PhoneNumber: `254${phone}`,
        CallBackURL: `${process.env.ngrok}api/v1/mpesa/callbackURL`,
        AccountReference: "Test",
        TransactionDesc: "Test",
      })
    )
    .end((response) => {
      if (response.error) throw new Error(response.error);

      data = response.raw_body;

      res.json({
        data,
      });
    });
});

exports.callBackURL = asyncHandler(async (req, res, next) => {
  let results = req.body.Body;

  // console.log(results.stkCallback, "amos");

  if (!req.body.Body.stkCallback.CallbackMetadata) {
    const output = results.stkCallback;
    return res.json({
      output,
    });
  }

  const phone = results.stkCallback.CallbackMetadata.Item[4].Value;
  const amount = results.stkCallback.CallbackMetadata.Item[0].Value;
  const trnx_id = results.stkCallback.CallbackMetadata.Item[1].Value;

  try {
    const payment = new daraja();

    payment.number = phone;
    payment.trnx_id = trnx_id;
    payment.amount = amount;

    payment.save();

    return res.json({
      results,
    });
  } catch (error) {
    return res.status({
      error,
    });
  }
});
