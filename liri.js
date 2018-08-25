
require("dotenv").config();

var keys = require("./keys.js");
var twitter = keys.twitter;
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var divider = "\n------------------------------------------------------------\n\n";
var arg = "";
arg = process.argv[3];
parseCommand(process.argv[2], arg);


// Show 8 most recent tweets // 

function myTweets() {

	var Twitter = require('twitter');

	// From exports of keys.js file
	var client = new Twitter({
		consumer_key: twitter.consumer_key,
		consumer_secret: twitter.consumer_secret,
		access_token_key: twitter.access_token_key,
		access_token_secret: twitter.access_token_secret
	});

	var params = {
		myTwitterUserName: 'testacctcolumb1',
		count: 8
	};
 

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if(error) { // if there IS an error
			console.log('Error occurred: ' + error);
		} else { // if there is NO error
	  	console.log("My 8 Most Recent Tweets");
	  	console.log("");

	  	for(var i = 0; i < tweets.length; i++) {
	  		console.log("( #" + (i + 1) + " )  " + tweets[i].text);
	  		console.log("Created:  " + tweets[i].created_at);
	  		console.log("");
	  	}
	  }
	});
}

function spotifySearch(song) {
    song = (song || "The Sign");
    console.log("Finding information on that song...\n");
	var spotify = new Spotify(keys.spotify);
	spotify.search({ type: 'track', query: "track:" + song, limit: 20 })
	.then(function(response) {
		var foundSong = false;
		for (var i = 0; i < response.tracks.items.length; i++) {
			if (response.tracks.items[i].name.toLowerCase() === song.toLowerCase()) {
                
				console.log("Here's some information for that song:\n");
				if (response.tracks.items[i].artists.length > 0) {
					var artists = response.tracks.items[i].artists.length > 1 ? "  Artists: " : "  Artist: ";
					for (var j = 0; j < response.tracks.items[i].artists.length; j++) {
						artists += response.tracks.items[i].artists[j].name;
						if (j < response.tracks.items[i].artists.length - 1) {
							artists += ", ";
						}
					}
					console.log(artists);
				}
				console.log("  Song: " + response.tracks.items[i].name);
				console.log(response.tracks.items[i].preview_url ? "  Preview: " + response.tracks.items[i].preview_url : "  No Preview Available");
                console.log("  Album: " + response.tracks.items[i].album.name);
				foundSong = true;
				break;
			}
		}
		if (!foundSong) {
			console.log("I'm Sorry, I couldn't find any songs called '" + song + "' on Spotify.");
		}
	})
	.catch(function(err) {
	    console.log("I'm sorry, but I seem to have run into an error.\n  " + err);
	});
};

function movieSearch(movie) {
	movie = movie || "Mr. Nobody";
	var queryUrl = "https://www.omdbapi.com/?apikey=40e9cece&s=" + movie; 
	console.log("Finding information on that movie ...\n");
	request(queryUrl, function (error, response, body) {
		if (error) {
			console.log("I'm sorry, but I seem to have run into an error.\n  " + error);
			return;
		}
		if (body && JSON.parse(body).Search && JSON.parse(body).Search.length > 0) {
			for (var i = 0; i < JSON.parse(body).Search.length; i++) {
				var result = JSON.parse(body).Search[i];
				if (result.Title.toLowerCase() === movie.toLowerCase()) {
		            var cont = false;
					var innerQueryURL = "https://www.omdbapi.com/?i=" + result.imdbID + "&apikey=trilogy";
					request(innerQueryURL, function (error, response, body) { // another request because the search result doesn't give enough information
						if (error) {
							console.log("I'm sorry, but I seem to have run into an error.\n  " + error);
							return;
						}
						if (body && JSON.parse(body) && JSON.parse(body).Response === "True") {
                            body = JSON.parse(body);
                            // console.log("Here's some information for that movie you were searching: \n");
							console.log("If you haven't watched 'Mr. Nobody,' then you should: <http://www.imdb.com/title/tt0485947/> It's on Netflix! Here's some information on it:\n");
							console.log("  Title: " + body.Title);
							console.log("  Year: " + body.Year);
							for (var j = 0; j < body.Ratings.length; j++) {
								if (body.Ratings[j].Source === "Internet Movie Database") {
									console.log("  IMDB Rating: " + body.Ratings[j].Value);
								} else if (body.Ratings[j].Source === "Rotten Tomatoes") {
									console.log("  Rotten Tomatoes Score: " + body.Ratings[j].Value);
								}
							}
							console.log("  " + (body.Country.indexOf(',') < 0 ? "Country: " : "Countries: ") + body.Country);
							console.log("  " + (body.Language.indexOf(',') < 0 ? "Language: " : "Languages: ") + body.Language);
                            console.log("  Plot: " + body.Plot);
                            console.log("  Actors: " + body.Actors);
						} else {
							cont = true;
						}
					});
					if (cont) {
						continue;
					}
					return;
				}
			}
			var result = JSON.parse(body).Search[0];
			var innerQueryURL = "https://www.omdbapi.com/?i=" + result.imdbID + "&apikey=trilogy";
			var ret = false;
			request(innerQueryURL, function (error, response, body) {
				if (error) {
					console.log("I'm sorry, but I seem to have run into an error.\n  " + error);
					return;
				}
				if (body && JSON.parse(body) && JSON.parse(body).Response === "True") {
					body = JSON.parse(body);
                    console.log("Here's some information for that movie you were searching: \n");
					console.log("  Title: " + body.Title);
					console.log("  Year: " + body.Year);
					for (var j = 0; j < body.Ratings.length; j++) {
						if (body.Ratings[j].Source === "Internet Movie Database") {
							console.log("  IMDB Rating: " + body.Ratings[j].Value);
						} else if (body.Ratings[j].Source === "Rotten Tomatoes") {
							console.log("  Rotten Tomatoes Score: " + body.Ratings[j].Value);
						}
					}
					console.log("  " + (body.Country.indexOf(',') < 0 ? "Country: " : "Countries: ") + body.Country);
					console.log("  " + (body.Language.indexOf(',') < 0 ? "Language: " : "Languages: ") + body.Language);
                    console.log("  Plot: " + body.Plot);
                    console.log("  Actors: " + body.Actors);
                    // fs.appendFile("log.txt", result + divider, function(error) {
                    //     if (error) throw error;
                    //   });
                    
				} else {
					ret = true;
				}
			});
			if (ret) {
				return;
			}
		} else {
			console.log("I'm sorry, I wasn't able to find any movies called '" + movie + "'. Please make sure to enter the exact movie name!");
		}
	});
};

function parseTxtCommand() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log("I'm sorry, but I seem to have run into an error.\n  " + error);
        }
        console.log("Fetching command...\n");
		var dataArr = data.split(",");
		parseCommand(dataArr[0], dataArr[1].replace(/"/g, ""));
	});
};

function parseCommand(command, arg) {
	switch (command) {

	case "my-tweets":
		myTweets();
		break;

	case "spotify-this-song":
		spotifySearch(arg);
		break;

	case "movie-this":
		movieSearch(arg);
		break;

	case "do-what-it-says":
		parseTxtCommand();
		break;

	case undefined:
	case "":
		console.log("Sorry, did you say something? Can you please repeat? ");
		break;

	default:
        console.log("I'm sorry, but I'm not sure what you mean by that. Please enter one of the following commands:\n \n'my-tweets': Show my latest 8 Tweets \n'spotify-this-song': Search Spotify API for information regarding song search \n'movie-this': Search OMBI API for information regarding movie search\n'do-what-it-says': Preforms command through random.txt file\n");
		break;

	}
};

