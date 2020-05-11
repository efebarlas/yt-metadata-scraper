# yt-metadata-scraper
A YouTube scraper for collecting metadata from a given list of URLs.

You can use the console.json file in the repository to try the tool out for yourself. You need to place the file where yt-scraper.js will run.
Also, it must be named 'console.json'.

If you would like to use a playlist, you can use the following commands in a browser console to get an array of video URLs:

**let videos = $$('a.ytd-playlist-video-renderer')**
**let urls = videos.map(video => video.href)**

This repository has room for improvement but it does the job. At 50 Mbit, it takes a minute to process 2000 video URLs.
