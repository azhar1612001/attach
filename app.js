var nodemailer = require('nodemailer');
const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs')
const multer = require('multer')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(bodyParser.json())

var name;
var email;
var phone;
var field;
var message;
var path

var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: Storage
}).single("resume"); //Field name and max count

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/sendData', (req, res) => {
    upload(req, res, function(err) {
        if (err) {
            console.log(err)
            return res.end("Something went wrong!");
        } else {
            name = req.body.name
            email = req.body.email
            phone = req.body.phone
            field = req.body.field
            message = req.body.message
            path = req.file.path
            console.log(name)
            console.log(email)
            console.log(phone)
            console.log(field)
            console.log(message)
            console.log(req.file)
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'noreplydeveloper16@gmail.com',
                    pass: 'Asgar@123'
                }
            });

            var mailOptions = {
                from: 'noreplydeveloper16@gmail.com',
                to: 'noreplydeveloper16@gmail.com',
                subject: "checking",
                text: `name:${name},email:${email},phone:${phone},field:${field},message:${message}`,
                attachments: [{
                    path: path
                }]
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    fs.unlink(path, function(err) {
                        if (err) {
                            return res.end(err)
                        } else {
                            console.log("deleted")
                            return res.redirect('/result.html')
                        }
                    })
                }
            });
        }
    })
})

app.listen(5000, () => {
    console.log("App started on Port 5000")
})