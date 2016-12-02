
//LIRI-APP 


//Requesting NPM Package
var request = require("request");
//Require Inquirer NPM Package
var inquirer = require("inquirer");
//Require Twitter NPM Package
var Twitter = require("twitter");
//Require Spotify NPM Package
var spotify = require("spotify");
//file system
var fs = require('fs'); 
//Referencing keys from our files
var keys = require("./keys.js");
// Twitter object with keys to access

/*
var client = new Twitter ({
		  consumer_key: '<fZ2stiYylhGWyyLcCn9InA0Ck>',
		  consumer_secret: '<vmhtRPrALPgVwwU3age48GtpIOjHK0bl9EHG7dcqk07Wt740Aa>',
		  access_token_key: '<191928620-ALPPrHTim6TMrlpnQ3Qk6asbGvV8eu767Xozgez8>',
		  access_token_secret: '<d2tBp7MqKVFAH4jjXdchglTNEuDc65Klo1jRONlg4qj7p>',
  });
*/

//*****************************************************************
			//Twitter
//*****************************************************************
//Twitter  

//This function allows you to log all data in a file called log.txt
var writeToLog = function(data) {
  fs.appendFile("log.txt", '\r\n\r\n');

  fs.appendFile("log.txt", JSON.stringify(data), function(err) {
    
    if (err) {
      return console.log(err);
    }

    console.log("log.txt updated!");
  });
}

//Creates a function for finding artist name from spotify
var getArtistNames = function(artist) {
  return artist.name;
};

//Function for finding songs on Spotify
var getMeSpotify = function(songName) {
  //If it doesn't find a song, find the song by Michael Jackson.
  if (songName === undefined) {
    songName = 'Thriller';
  };

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }
// THis function allows you view what we are requesting 
    var songs = data.tracks.items;
    
    var data = []; //empty array to hold data

    for (var i = 0; i < songs.length; i++) {
      data.push({
        'artist(s)': songs[i].artists.map(getArtistNames),
        'song name: ': songs[i].name,
        'preview song: ': songs[i].preview_url,
        'album: ': songs[i].album.name,
      });
    }
    console.log(data);
    writeToLog(data);
  });
};

// Twitter Fuction is logging in and the displaying Client latest tweets.

var   getTweets = function() {
  var client = new Twitter({

    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret

  });
  console.log(keys.twitterKeys);

  var params = { screen_name: 'erikjp512' };

  client.get("statuses/user_timeline", params, function(error, tweets, response) {
    //console.log(tweets);
    if (!error) {
      //console.log('response : ' + response);
      var data = []; //empty array to hold data
      for (var i = 0; i < tweets.length; i++) {
        /*
        data.push({
            'created at: ' : tweets[i].created_at,
            'Tweets: ' : tweets[i].text,
        });
        */
        console.log('created at: ' + tweets[i].created_at);
        console.log('Tweets: ' + tweets[i].text);
      }
      console.log(data);
      //console.log(response[i] + "\n");
    } else{
      console.log(error);
    }
  });
};
//This Function allows us to serch a movie 
var getMeMovie = function(movieName) {

  if (movieName === undefined) {
    movieName = 'The Lion King';
  }
//Movie API CDN
  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = [];
      var jsonData = JSON.parse(body);

      data.push({
      'Title: ' : jsonData.Title,
      'Year: ' : jsonData.Year,
      'Rated: ' : jsonData.Rated,
      'IMDB Rating: ' : jsonData.imdbRating,
      'Country: ' : jsonData.Country,
      'Language: ' : jsonData.Language,
      'Plot: ' : jsonData.Plot,
      'Actors: ' : jsonData.Actors,
      'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
      'Rotton Tomatoes URL: ' : jsonData.tomatoURL,
  });
      console.log(data);
      writeToLog(data);
}
  });

}


var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
    writeToLog(data);
    var dataArr = data.split(',')

    if (dataArr.length == 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1) {
      pick(dataArr[0]);
    }

  });
}

var pick = function(caseData, functionData) {
  switch (caseData) {
    case 'my-tweets':
      getTweets();
      break;
    case 'spotify-this-song':
      getMeSpotify(functionData);
      break;
    case 'movie-this':
      getMeMovie(functionData);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log('LIRI doesn\'t know that');
  }
}

//run this on load of js file
var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);
