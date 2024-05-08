require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const responseTime = require('response-time');


async function main() {
    await mongoose.connect(process.env.REMOTE_URL);
    console.log('mongodb connection established on port 27017');
}

main().catch(err => console.log(err));

const app = express();

app.use(express.json());

app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

app.use(responseTime());

app.listen(process.env.PORT);
app.use(express.static("public"));

const accessLogStream = fs.createWriteStream(path.join(__dirname, `/logs/access-${new Date().toISOString().slice(0, 10)}.log`), { flags: 'a' });


morgan.token('custom', (req, res) => {
    return `Date: ${new Date().toISOString()}
Method: ${req.method}
Route: ${req.originalUrl}
Status: ${res.statusCode}
Response time: ${res.get('X-Response-Time')} \n`;
});

app.use(morgan(':custom', {
    stream: accessLogStream,
}));

require('./handlers/plumber/plumber.js')(app);
require('./handlers/opinions/opinion')(app);
require('./handlers/admin/admin')(app);
require('./initial-data/initial-data.service');


app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});
