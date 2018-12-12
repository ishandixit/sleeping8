var ip = require("ip");
const authenticate = require('../model/authenticate');
const fs = require('fs');
var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: constants.AWS.S3_ACCESS_KEY_ID,
    secretAccessKey: constants.AWS.S3_SECRET_ACCESS_KEY
});
var s3 = new AWS.S3();
exports.fieldsRequire = function (req, res) {
    return res.status(constants.RETURN_STATUS.FIELDS_REQUIRED.STATUS_CODE).send({ status: constants.RETURN_STATUS.FIELDS_REQUIRED.STATUS_CODE, message: "Fields required" });
};

exports.success = function (req, res, resData) {
    if(resData && resData.length) {
        return res.status(constants.RETURN_STATUS.SUCCESS.STATUS_CODE).send(resData);
    } else {
        return res.status(constants.RETURN_STATUS.SUCCESS.STATUS_CODE).send({ status: constants.RETURN_STATUS.SUCCESS.STATUS_CODE, message: constants.RETURN_STATUS.SUCCESS.MESSAGE, data: resData });
    }
}

exports.notFound = function (req, res) {
    return res.status(constants.RETURN_STATUS.NOT_FOUND.STATUS_CODE).send({ status: constants.RETURN_STATUS.NOT_FOUND.STATUS_CODE, message: constants.RETURN_STATUS.NOT_FOUND.MESSAGE});
}

exports.error = function (req, res) {
    console.log(req.err);
    return res.status(constants.RETURN_STATUS.ERROR.STATUS_CODE).send({ status: constants.RETURN_STATUS.ERROR.STATUS_CODE, message: constants.RETURN_STATUS.ERROR.MESSAGE });
}
exports.exists = function (req, res) {
    return res.status(constants.RETURN_STATUS.EXISTS.STATUS_CODE).send({ status: constants.RETURN_STATUS.EXISTS.STATUS_CODE, message: constants.RETURN_STATUS.EXISTS.MESSAGE });
}
exports.currentCountry = function (req, res) {
    if(req.body.currentCountry)
        return req.body.currentCountry;
    else
        return 1;
}
exports.currentUser = function (req, res) {
    if(req.currentUser)
        return req.currentUser;
    else
        return {id:1};
}
exports.currentIP = function (req, res) {
    console.log(typeof ip.address())
    return ip.address();
}

exports.validateAuth = function (req, res, next) {
    var auth = req.headers.authorization; 
    // On the first request, the "Authorization" header won't exist, so we'll set a Response
    if (!auth) {
        return res.status(constants.RETURN_STATUS.UNAUTHORIZED.STATUS_CODE).send({ status: constants.RETURN_STATUS.UNAUTHORIZED.STATUS_CODE, message: constants.RETURN_STATUS.UNAUTHORIZED.MESSAGE });
    } else {
        // If the user enters a username and password, the browser re-requests the route
        // and includes a Base64 string of those credentials.
        var credentials = new Buffer(auth.split(" ").pop(), "base64").toString("ascii").split(":");
        console.log(credentials[0],credentials[1]);
        if(constants.UNAUTHORIZED_URLS.indexOf(req.path)!=-1 && req.method !== 'DELETE'){
            if (credentials[0] === constants.API_AUTH.USERNAME && credentials[1] === constants.API_AUTH.KEY) {
                // The username and password are correct, so the user is authorized.
                next();
            } else {
                return res.status(constants.RETURN_STATUS.UNAUTHORIZED.STATUS_CODE).send({ status: constants.RETURN_STATUS.UNAUTHORIZED.STATUS_CODE, message: constants.RETURN_STATUS.UNAUTHORIZED.MESSAGE });
            }
        }else{
            req.data={};
            req.data.user_id=credentials[0];
            req.data.token=credentials[1];
            authenticate.validateSession(req,function(err, result){
                if(err) {
                    req.err = err;
                    return common.error(req, res);
                } else {
                    if(result && result.length>0){
                        next();
                    }else{
                        return res.status(constants.RETURN_STATUS.UNAUTHORIZED.STATUS_CODE).send({ status: constants.RETURN_STATUS.UNAUTHORIZED.STATUS_CODE, message: constants.RETURN_STATUS.UNAUTHORIZED.MESSAGE });
                    }
                }
            });
        }

    }
};

exports.deactivatedUser= function(req,res){
    console.log(constants.RETURN_STATUS.DEACTIVATED_USER.STATUS_CODE);
    return res.send({ status: constants.RETURN_STATUS.DEACTIVATED_USER.STATUS_CODE, message: constants.RETURN_STATUS.DEACTIVATED_USER.MESSAGE });
}