

const express = require( "express" );
const bodyParser = require( "body-parser" );
const serve   = require('express-static');
const formidable = require( "formidable" );
const path = require( "path" );
const mongojs = require( "mongojs" );
const request = require( "request" );

const port = process.env.PORT || 3000;

const app = express();
const form = new formidable.IncomingForm();

var databaseUrl = "nyt";
var databaseUrl = 'mongodb://dknapp:mongo@ds111441.mlab.com:11441/heroku_x3lz038m';
var collections = ["nyt"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use( serve( path.join( __dirname, "/public" ) ) );

app.get( "/search", function( req, res ) {

    console.log( "query: ", req.query );

    request.get({
      url: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
      qs: {
        'api-key': "8038b91baf03458496aa80e25521465b",
        'q': req.query.searchTerms,
        'begin_date': req.query.startYear,
        'end_date': req.query.endYear,
        'sort': "newest",
        'page': 0
      },
    }, function(err, response, body) {
      body = JSON.parse(body);
      //console.log(body);
      res.json( body );
    })
})

app.get( "/saved", function( req, res ) {
    db.nyt.find({}, function( err, found ) {
        if ( err ) console.log( err );

        // console.log( "SAVED ARTICLES: ", found );
        res.json( found );
    });
});

app.post( "/save", function( req, res ) {
    //console.log( req.body );
    console.log( "/save", req.body.pub_date )
    req.body.key = req.body['_id'];
    db.nyt.insert( req.body );

    res.json( {status: "OK"} );
})

app.delete( "/remove/:id", function( req, res ) {
    console.log( req.params );
    db.nyt.remove( { 'key': req.params.id },
        function( err, resp ) {
            console.log( "Remove returned." );
            res.redirect( "http://localhost:3000" );
        }
    );
    //res.json( { "status": "OK" } )
})

app.listen( port, function() {
    console.log( "Listening on " + port );
})
