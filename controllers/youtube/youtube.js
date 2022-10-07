require("dotenv").config();
const { google } = require("googleapis");
const youtube = google.youtube({
  version: "v3",
  auth: process.env.Youtube_API,
});

const searchOnYoutube = async (req, res, next) => {
  try {
    const query = req.query.search;
    const response = await youtube.playlistItems.list({
      part: "snippet",
      playlistId: "PLIScshDnisWFNhmNk1ASQgHHKzoloCc7M",
      maxResults: 100,
    });
    const info = response.data.items
      .map((item) => {
        return {
          title: item.snippet.title,
          videoId: item.snippet.resourceId.videoId,
        };
      })
      .reverse();
    res.json(info);
  } catch (error) {
    res.json({ error });
  }
};

module.exports = searchOnYoutube;
