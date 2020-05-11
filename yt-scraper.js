const rp = require("request-promise");

//  You can get a video's attributes even if you don't run JS. 
//  Hence, we'll use cheerio instead of puppeteer.
const $ = require('cheerio');
const fs = require('fs');

const url = '';
let attrFound = false;
var title = null;
var desc = null;
var tags = null;
let videos = [];

/*  There is a demo console.json file inside the repository,
    but if you want to try it out on your own:

    To get the urls from playlist, you can use the following
    comments in Chrome's console, while you're in your
    selected playlist's page:

    let videos = $$('a.ytd-playlist-video-renderer')
    let urls = videos.map(video => video.href)

    To download the urls array, you can use a snippet called
    console.save. For more information:
    http://www.markdebeer.com/blog/saving-a-json-object-to-a-file-in-chrome-dev-tools/

    NOTE:   You might need to scroll all the way down the
            playlist to access all videos. My bad.
*/

let urlsJSON = fs.readFileSync('console.json', 'utf8');

let urls = JSON.parse(urlsJSON);

var last_url_processed = null;

urls.forEach(function(url, index, array) {
    if (index === array.length - 1) { 
        last_url_processed = rp(url).then(function(html) {
            // get title of the video
            title = $('meta[property|="og:title"]', html)['0'].attribs.content;
            
            // get tags of the video
            tags = $('meta[name|="keywords"]', html)['0'].attribs.content.split(',');
            
            // get description of the video
            desc = $('meta[property|="og:description"]', html)['0'].attribs.content;
            
            // push found attributes to an array
            videos.push({'url':url, 'title':title, 'tags':tags, 'desc':desc});
        }).catch(function(err){});
    } else {
        rp(url).then(function(html) {
            // get title of the video
            title = $('meta[property|="og:title"]', html)['0'].attribs.content;
            
            // get tags of the video
            tags = $('meta[name|="keywords"]', html)['0'].attribs.content.split(',');
            
            // get description of the video
            desc = $('meta[property|="og:description"]', html)['0'].attribs.content;
            
            // push found attributes to an array
            videos.push({'url':url, 'title':title, 'tags':tags, 'desc':desc});
        }).catch(function(err){});
    }
});

/*
    NOTE: These callback functions will be run AFTER the stack 
    has been cleared. Therefore, console.log(videos) will just 
    print []. You need to wait for the promise
    before looking at the object called 'videos'.
*/

// You can use await/async to wait for a Promise.
async function print_video_info() {
    await last_url_processed;
    fs.writeFileSync('video_info.json', JSON.stringify(videos),'utf-8');
}

print_video_info();