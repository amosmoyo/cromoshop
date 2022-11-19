const unirest = require("unirest");

exports.getAccessToken = async (req, res, next) => {
  //   const reqq = unirest(
  //     "GET",
  //     "https://sandbox.safaricom.co.ke/oauth/v1/generate"
  //   );

  const token = new Buffer.from(
    `${process.env.Consumer_key}:${process.env.Consumer_Secret}`
  ).toString("base64");

  let reqq = unirest(
    "GET",
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
  )
    .headers({
      Authorization: "Basic " + token,
    })
    .send()
    .end((response) => {
      if (response.error) throw new Error(response.error);

      //   console.log(response.raw_body);

      data = response.body;

      req.access_token = data.access_token;

      next();
    });
};

// let req = unirest('GET', 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
// .headers({ 'Authorization': 'Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==' })
// .send()
// .end(res => {
// 	if (res.error) throw new Error(res.error);
// 	console.log(res.raw_body);
// });
