
const express = require( "express" );
const bodyParser = require( "body-parser" );
const serve   = require('express-static');
const formidable = require( "formidable" );
const path = require( "path" );
const mongo = require( "mongojs" );
const request = require( "request" );

const port = process.env.PORT || 3000;

const app = express();
const form = new formidable.IncomingForm();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use( serve( path.join( __dirname, "/public" ) ) );

app.get( "/search", function( req, res ) {

    console.log( "Body: ", req.body );


    request.get({
      url: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
      qs: {
        'api-key': "8038b91baf03458496aa80e25521465b",
        'q': "Germany",
        'begin_date': "19010101",
        'end_date': "19100101",
        'sort': "newest",
        'page': 0
      },
    }, function(err, response, body) {
      body = JSON.parse(body);
      console.log(body);
      res.json( body );
    })


})

app.post( "/save", function( req, res ) {
    console.log( req.body );
    form.parse( req, function( err, fields, files ) {

    })

    res.json( {status: "OK"} );
})

app.listen( port, function() {
    console.log( "Listening on " + port );
})
