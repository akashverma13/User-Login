const express = require("express");
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
//Homepage Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/login", function (req, res) {
    validateLogin(req, res);
});

app.post("/register", function (req, res) {
    validateRegistration(req, res);
});


function validateLogin(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    checkUser(req, res, username, password);
}

function validateRegistration(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    if (username == "" || password == "") {
        res.send("All fields must be filled out");
    }
    else {
        insertUser(req, res, username, password);
    }
}

function insertUser(req, res, username, password) {
    MongoClient.connect(
        "mongodb://localhost:27017",
        { useUnifiedTopology: true, useNewUrlParser: true },
        function (err, client) {
            // Client returned
            var db = client.db("login");
            db.collection("users", function (err, collection) {
                collection.find({ username: username }).toArray(function (err, items) {
                    if (err) throw err;
                    console.log(items);
                    if (items.length == 0) {
                        let pwd = bcrypt.hashSync(password, 10);
                        // document to be inserted
                        var doc = { username: username, password: pwd };
                        db.collection("users").insertOne(doc, function (err, res) {
                            if (err) throw err;
                            console.log("Document inserted");
                        });
                        res.send("User added, please login!");
                    }
                    else {
                        res.send("User with this username already exists!");
                    }
                });
            });
        }
    );
}

function checkUser(req, res, username, password) {
    MongoClient.connect(
        "mongodb://localhost:27017",
        { useUnifiedTopology: true, useNewUrlParser: true },
        function (err, client) {
            var db = client.db("login");
            db.collection("users", function (err, collection) {
                collection.find({ username: username}).toArray(function (err, items) {
                    if (err) throw err;
                    console.log(items);
                    if (items.length != 0) {
                        if(bcrypt.compareSync(password, items[0].password)) {
                            res.send("Logged in:" + username + ", " + password);
                        }
                        else {
                        res.send("Check password!");
                        }
                    }
                    else {
                        res.send("No user found with this username & password");
                    }
                });
            });
        }
    );
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));