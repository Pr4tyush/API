//jshint esversion:6

// HEROKU NAME: rugged-virgin-islands-14550.herokuapp.com
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const fs = require("fs");

require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// -------------------------------------- START - app.get() ------------------------------------------ //

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// -------------------------------------- END - app.get() ------------------------------------------ //


// -------------------------------------- START - app.post() ------------------------------------------ //

app.post("/", function(req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.eMail;

  const data = {
    members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        } // ends 'merge_fields' object
      } // ends 'member' object --> for this project only a single member will be added [singular]
    ] // ends 'members' array of objects if we are adding multiple aka [plural]
  }; // ends 'data'

  const jsonData = JSON.stringify(data);

  // Tried to store the entire MailChimp ENDPOINT in a dotenv variable and error occurred. Status code 404 Resource Not Found. Check images for a screenshot of the error
  // https://mailchimp.com/developer/guides/marketing-api-conventions#http-methods 
  const url = "https://us21.api.mailchimp.com/3.0/lists/f61031c2fa"; // This will come from the main mail-chimp 'endpoint'

  const options = {
    method: "POST",
    auth: "Pratyush:2dbc943a736d221a74a2c5a97ea7693c-us21"
  };

  const request = https.request(url, options, function(response) {

    // ------ START - Error Handling ------ //
    console.log("Status Code: " + response.statusCode);

    if (response.statusCode === 200)
      res.sendFile(__dirname + "/success.html");
    else
      res.sendFile(__dirname + "/failure.html");

    // ------ END - Error Handling ------ //

    response.on("data", function(data) {

      const parseData = JSON.parse(data); // This will turn the json we recieve into a JavaScript Object
      console.log(parseData); // Printing the data received in the console.
      
      // In order to export that data into a jSON file it must not be parsed.
      // fs.writeFile("new_jSON_File.json", data, 'utf8', function(){
      // This is just an empty callback() function to be able to write the json file we recieved into a .json file
      // });
      //console.log("Printing out errors: " + parseData.errors[0].error); // In order to print out results from the json data we recieved it must be parsed

      // console.log(parseData);

    }); // ends 'response.on'
  }); // ends 'https.request'

  //request.write(jsonData); // removing this will cause the app to fail. Triggering the 'failure.html'
  request.end();

}); // ends 'app.post'

app.post("/failure", function(req, res) {
  res.redirect("/");
}); // ends 'app.post()' redirect

// REFERENCE --> https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
// REFERENCE --> https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
// REFERENCE --> https://nodejs.org/api/https.html#https_https_request_options_callback
// REFERENCE --> https://node.readthedocs.io/en/latest/api/https/#httpsrequestoptions-callback

// -------------------------------------- END - app.post() ------------------------------------------ //


// -------------------------------------- START - app.listen() -------------------------------------- //

// Heroku changes -- START
// process.env.PORT -- Dynamic port that Heroku will define on-the-go
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on PORT: 3000");
});

// -------------------------------------- END - app.listen() -------------------------------------- //
