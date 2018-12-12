var express = require('express')
var app = express()
var bcrypt = require('bcryptjs');
var randomstring = require("randomstring").generate(7)
var profileModel = require('../model/profileDetails')

let tempPassword = "1234"

exports.logic = async (req, res) => {
    try {
        let data = req.body
        let signUpSuccess;
        console.log("helloo", data)
        let checkForAlreadyExists = await profileModel.signUpModel.findOne({
            "emailAddress": data.emailAddress
        }).lean().exec()
        if (checkForAlreadyExists == null || checkForAlreadyExists == undefined) {
            let salt = await bcrypt.genSaltSync(10)
            let password = await bcrypt.hash(tempPassword, salt)

            if (data != null || data != undefined || data != "") {
                if (data.userType == "" || data.userType == "explorer") {
                    signUpSuccess = new profileModel.signUpModel({
                        "firstName": data.firstName,
                        "lastName": data.lastName,
                        "userName": data.userName,
                        "emailAddress": data.emailAddress,
                        "userId": randomstring,
                        "userType": "explorer",
                        "password": password,
                        "contactNumber":data.contactNumber
                    })
                    await signUpSuccess.save()
                    return res.status(200).send({
                        "outputCode": 200,
                        "message": "user successfully signed up as explorer",
                        "data": signUpSuccess
                    })
                }
                if(data.userType == "corporate"){
                    signUpSuccess = new profileModel.signUpModel({
                        "userName": data.userName,
                        "entityName":data.entityName,
                        "emailAddress": data.emailAddress,
                        "userId": randomstring,
                        "userType": "corporate",
                        "password": password,
                        "contactNumber":data.contactNumber,
                        "nameOfAuthRepresentative":data.nameOfAuthRepresentative,
                        "GSTIN":data.GSTIN
                    })
                    await signUpSuccess.save()
                    return res.status(200).send({
                        "outputCode": 200,
                        "message": "user successfully signed up as corporate",
                        "data": signUpSuccess
                    })
                }
                if(data.userType == "artist"){
                    signUpSuccess = new profileModel.signUpModel({
                        "firstName": data.firstName,
                        "lastName": data.lastName,
                        "userName": data.userName,
                        "entityName":data.entityName,
                        "emailAddress": data.emailAddress,
                        "userId": randomstring,
                        "userType": "artist",
                        "password": password
                    })
                    let contactNumber;
                    if(data.contactNumber){
                        signUpSuccess.contactNumber = data.contactNumber
                    }
                    await signUpSuccess.save()
                    return res.status(200).send({
                        "outputCode": 200,
                        "message": "user successfully signed up as artist",
                        "data": signUpSuccess
                    })
                }
                if(data.userType == "agency"){
                    signUpSuccess = new profileModel.signUpModel({
                        "userName": data.userName,
                        "entityName":data.entityName,
                        "emailAddress": data.emailAddress,
                        "userId": randomstring,
                        "userType": "artist",
                        "password": password
                    })
                    let contactNumber;
                    if(data.contactNumber){
                        signUpSuccess.contactNumber = data.contactNumber
                    }
                    await signUpSuccess.save()
                    return res.status(200).send({
                        "outputCode": 200,
                        "message": "user successfully signed up as artist",
                        "data": signUpSuccess
                    })
                }
            } else {
                return res.status(300).send({
                    "outputCode": 300,
                    "message": "Please provide data in the body"
                })
            }
        } else {
            return res.status(201).send({
                "outputCode": 201,
                "message": "looks like you are already registered on sleeping8"
            })
        }

    } catch (error) {
        return res.status(300).send({
            "outputCode": 300,
            "message": "internal logic error"
        })
    }
}