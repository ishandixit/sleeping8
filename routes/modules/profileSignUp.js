var router = require('express').Router();
var profileCtrl = require('../controller/profileSignUp')

router.route('/signup')
        .post(profileCtrl.logic)
        
module.exports = router
