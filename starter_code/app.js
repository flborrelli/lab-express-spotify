require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// the routes go here:

//GET homepage
app.get('/', (req, res, next) => {
  res.render('index');
})


//GET artist page
app.get('/artists', (req, res, next) => {
//   res.send(req.query);
  // console.log(req.query);
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    let artistsList = data.body.artists.items; //This is the array of objects provided by API
    // console.log('The received data from the API: ', artistsList[0]); //Log the 1st object of the array
    res.render('artists', artistsList); // Render the artists.hbs file and the array of objects
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
})

//GET albums page
app.get("/albums/:artistId", (req, res, next) => {
  let id = req.params;
  spotifyApi
  .getArtistAlbums(id.artistId)
  .then(data => {
    console.log(data.body.items);
    res.render('albums', data.body);
    // res.send(data.body);
  })
  .catch(err => {
    console.log('The error while searching album occurred: ', err);
  })
})

//GET tracks page
app.get("/tracks/:albumId", (req, res, next) => {
  let id = req.params;
  spotifyApi.getAlbumTracks(id.albumId, { limit : 10, offset : 0 })
  .then(function(data) {
    res.render('tracks', data.body);
    // res.send(data.body);
  }, function(err) {
    console.error(err);
  });
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
