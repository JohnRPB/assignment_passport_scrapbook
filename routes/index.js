var express = require('express');
var router = express.Router();
var FB = require('fb');
const models = require('../models/');
const User = models.User;
const credentials = require('../facebook_credentials.json');
const fs = require('fs');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const user = await User.findById(req.session.passport.user);

  fs.readFileSync('./facebookAccess.js', 'utf8')
  await FB.setAccessToken();
  FB.api(`/${user.facebookId}/photos`, function(response) {
    if (response && !response.error) {
      console.log('here?');
      console.log(response);
    }
    console.log('outside' + JSON.stringify(response));
  });

  res.render('index', {title: 'Express'});
});

module.exports = router;
