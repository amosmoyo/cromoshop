// *** Authorization Request in NodeJS ***|

var unirest = require("unirest");

var reqq = unirest("GET", "https://sandbox.safaricom.co.ke/oauth/v1/generate");

const express = require("express");

const router = express.Router();

const daraja = (req, res) => {
  reqq.query({
    grant_type: "client_credentials",
  });

  reqq.headers({
    Authorization:
      "Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==",
  });

  reqq.end((res) => {
    if (res.error) throw new Error(res.error);
    console.log(res.body);
  });
};

router.route("/payment").get(daraja);
// let unirest = require('unirest');
// let req = unirest('GET', 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
// .headers({ 'Authorization': 'Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==' })
// .send()
// .end(res => {
//     if (res.error) throw new Error(res.error);
//     console.log(res.raw_body);
// });


module.exports = router;