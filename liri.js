var inquirer = require("inquirer");
var keys = require("./keys.js");
var request = require('request');
var fs = require('fs');

inquirer.prompt([
    {
        type: 'list',
        name: 'command',
        message: "Choose a command",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
    }
]).then(function (answers) {
    console.log(answers);
    switch (answers.command) {
        case "my-tweets":
            Tweets();
            break;
        case "spotify-this-song":
            inquirer.prompt([
                {
                    type: "input",
                    name: "song",
                    message: "what is a song?",
                    default: "The Sign by Ace of Base"
                }
            ]).then(function (answer) {
                spotifyThisSong(answer.song);
            })
                .catch(function (err) {
                    console.log(err);
                });
            break;
        case "movie-this":
            inquirer.prompt([
                {
                    type: "input",
                    name: "movie",
                    message: "what is a movie?",
                    default: "Mr. Nobody."
                }
            ]).then(function (answer) {
                movieThis(answer.movie);
            })
                .catch(function (err) {
                    console.log(err);
                });
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("default case")
    }
}).catch(function (reason) {
    console.error(reason)
});


function Tweets() {
    var Twitter = require('twitter');
    var client = new Twitter(keys.twitterKeys);
    var params = { screen_name: 'Katrina19901990', "count": 20 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("@Katrina19901990: " + tweets[i].text);
                console.log("Posted: " + tweets[i].created_at)
            }
        }
        else { console.log(error) }
    });
}


function spotifyThisSong(song) {
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotify);
    spotify.search({ type: 'track', query: song })
        .then(function (response) {
            var tracks = response.tracks.items
            for (var i = 0; i < tracks.length; i++) {
                var song = " Track: '" + tracks[i].name + "'\n Album: '" + tracks[i].album.name + "'\n  by ";
                for (var j = 0; j < tracks[i].artists.length; j++) {
                    song += tracks[i].artists[j].name + ", ";
                }
                song = song.slice(0, song.length - 2);
                song += "\n URL: " + tracks[i].preview_url + "\n\n";

                console.log(song);
            }

        })
        .catch(function (err) {
            console.log(err);
        });

};


function movieThis(movie) {
    var omdb = keys.omdb;
    var content = [];
    var url = "http://www.omdbapi.com/?apikey=" + omdb.apikey + "&t=" + movie;
    request(url, function (error, response, body) {
        if (error) {
            console.log(error);
        }
        var data = JSON.parse(body);
        content.push(data.Title);
        content.push(data.Year);
        content.push(data.imdbRating);
        content.push(data.Ratings[1].Value);
        content.push(data.Language);
        content.push(data.Plot);
        content.push(data.Actors);

        for (var i = 0; i < content.length; i++) {
            console.log(content[i]);
        }
    });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error){
            console.log(error);
        }
        var info = data.split(",");
        var command = info[0];
        var value = info[1];
        switch (command) {
            case "my-tweets":
                Tweets();
                break;
            case "spotify-this-song":
                    spotifyThisSong(value);
                break;
            case "movie-this":
                    movieThis(value);
                break;
            case "do-what-it-says":
                doWhatItSays();
                break;
            default:
                console.log("default case")
        };
    });
};


