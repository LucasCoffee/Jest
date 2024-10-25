const express = require("express");
let app = express();

const mongoose = require("mongoose");
const user = require("../model/user");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");

const JWTSecret = "sdmioravmiorvnm~dl.m\copw4f"

app.use(express.urlencoded({extended: false}));
app.use(express.json());

mongoose.set('strictQuery', true)
mongoose.connect("mongodb://localhost:27017/", {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
    })
    .catch(err => {
        console.log(err)
    })

let User = mongoose.model("User", user);

app.get("/", (req, res) => {
    res.json({})
});

app.post("/user", async (req, res) => {

    for (const key in req.body) {
        if (req.body[key] == "") {
            res.sendStatus(400) 
            return;
        }
    }

    try {

        var user = await User.findOne({"email": req.body.email});

        if (user != undefined) {
            res.statusCode = 400;
            res.json({error: "E-mail já cadastrado"})
            return
        } 

        var password = req.body.password
        var salt = await bcrypt.genSalt(10);
        var hash = await bcrypt.hash(password, salt)

        let newUser = new User({
            name: req.body.name, 
            email: req.body.email,
            password: hash
        });

        await newUser.save()
        res.json({email: req.body.email});

    } catch (error) {
        res.statusCode(500);
    }
});

app.delete("/deleUserSecret:/email", async (req, res) => {

    try {
        await User.deleteOne({"email": req.body.email})
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
    }

});

app.post("/auth", async (req, res) => {
    let {email, password} = req.body;

    let user = await User.findOne({"email": email})

    if(user == undefined){
        res.statusCode = 403,
        res.json({errors:{email: "E-mail não cadastrado"}})
        return;
    }

    var isPasswordRight = bcrypt.compare(password, user.password);

    if(!isPasswordRight){
        res.statusCode = 403;
        res.json({errors: {senha: "Senha incorreta"}})
        return
    }

    jwt.sign({email}, JWTSecret, {expiresIn: "1h"}, (err, token) => {
        if(err){
            res.sendStatus(500);
            console.log(err)
        }
        res.json({token})
    })
})

module.exports = app