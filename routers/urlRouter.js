const express = require("express");
const urlModel = require("../models/urlModel");
const dns = require('dns');
const router = new express.Router();

router.get("/shorturl/:short_url", async (req, res) => {
  try {

    let shortUrlNum = req.params.short_url;
    console.log('shortUrlNum', shortUrlNum);

    let searchUrl = await urlModel.findOne({
      short_url: shortUrlNum
    });
    console.log('searchUrl', searchUrl);

    if (searchUrl && searchUrl.original_url) {
      res.redirect(searchUrl.original_url);
      return;
    }
    res.json({ error: 'invalid short url' });
  } catch (err) {
    res.json(err);
  }
});

router.post("/shorturl/", async (req, res) => {
  let requestedUrl = req.body.url;
  console.log('reQBODY', requestedUrl);

  try {

    //check URL format 
     let urlRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);
 
     if (!requestedUrl.match(urlRegex)) {
       res.json({ error: 'invalid url' })
       return;
     }

    //validate URL
    let convertedUrl = new URL(requestedUrl);
    let lookupResult = await lookupDomain(convertedUrl.hostname);
    console.log(lookupResult);


    //checks if URL exists
    let findUrl = await urlModel.findOne({
      original_url: requestedUrl
    });
    if (findUrl) {
      console.log('url Found!!');
      res.json(findUrl);
      return;
    }

    //new URL creation logic
    console.log('url NOT Found, saving new');
    let currentShortUrl = 0;

    let latestUrl = await urlModel
      .find({})
      .sort({ short_url: 'desc' })
      .limit(1)
      .exec();
    console.log('latestShortUrl', latestUrl);
    if (latestUrl.length > 0) {
      currentShortUrl = latestUrl[0].short_url += 1;
    }

    let newURL = new urlModel({
      original_url: requestedUrl,
      short_url: currentShortUrl
    });
    let savedUrl = await newURL.save();
    res.json(savedUrl);
  } catch (err) {
    console.log('error', err);
    res.json(err);
  }
});

const lookupDomain = (domainName) => {
  return new Promise((resolve, reject) => {
    dns.lookup(domainName, (err, address, family) => {
      if (err) {
        console.log('domainName >>', domainName, err);
        reject({ error: 'invalid url' });
      }
      resolve(address);
    });
  });
}

module.exports = router;