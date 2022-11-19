const express = require("express");

const {getAccessToken} = require('../middleware/daraja');

const {setAccessToken, stk, callBackURL} = require('../controller/lipaNaMpesa')

const router = express.Router();


router.route('/getAccessToken').get(getAccessToken, setAccessToken);

router.route('/stk').post(getAccessToken, stk)

router.route('/callbackURL').post(callBackURL)

module.exports = router