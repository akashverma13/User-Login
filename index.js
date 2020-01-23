const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
//Homepage Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post('/login', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    res.send(username);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));