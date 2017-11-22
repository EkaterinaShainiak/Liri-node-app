var inquirer = require("inquirer");
var keys = require("./keys.js");


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
            break;
        case "do-what-it-says":
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



