const express = require('express');
const app = express();
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');


// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
 
    // Validate the audience and the issuer.
    audience: process.env.AUTH0_AUDIENCE ,
    issuer: `https://${process.env.AUTH0_DOMAIN}`,
    algorithms: ['RS256']
});


//MiddleWares
app.use(cors());
app.use(bodyParser.json());

//Import Routes
const postsRoute = require('./routes/posts');
app.use('/posts', postsRoute);


//ROUTES
app.get('/',(req,res) =>{
    res.send('We are on home');
});

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true } ,() => console.log('connected to db!'));

//How to start listening to server
app.listen(3000);

//Auth0 jwt part located below
const checkScopes = jwtAuthz([ 'read:messages' ]);

// This route doesn't need authentication
app.get('/api/public', function(req, res) {
    res.json({
      message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
    });
  });
  
  // This route needs authentication
  app.get('/api/private', checkJwt, function(req, res) {
    res.json({
      message: 'Hello from a private endpoint! You need to be authenticated to see this.'
    });
  });

  app.get('/api/private-scoped', checkJwt, checkScopes, function(req, res) {
    res.json({
      message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
    });
  });
