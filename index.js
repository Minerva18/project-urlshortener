require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

require("./db/mongoose")

const urlRouter = require("./routers/urlRouter");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded());

app.use((req, res, next) => {
  console.log('----- New Request Info Start -----');
  console.log("path >> ", req.path);
  console.log("method >> ", req.method);
  console.log("params >> ", req.params);
  console.log("body >> ", req.body);
  console.log('----- New Request Info End -----');
  next();
});

app.use('/api', urlRouter);

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', async function(req, res) {
  res.json({ response: "Hello World" });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
