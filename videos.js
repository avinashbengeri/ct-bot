const axios = require('axios')
const _ = require('lodash')

const videos = {
  C: [
    "2NWeucMKrLI",
    "rk2fK2IIiiQ",
    "-CpG3oATGIs"
  ],
  'C++': [
    "Rub-JsjMhWY",
    "tvC1WCdV1XU",
    "MhYECGUzdA4"
  ],
  JAVA: [
    "WPvGqX-TXP0",
    "Hl-zzrqQoSE",
    "r59xYe3Vyks"
  ],
  PYTHON: [
    "N4mEzFDjqtA",
    "HBxCHonP6Ro",
    "sEL6AsovDDQ"
  ],
  HTML: [
    "bfqBUDk99Tc",
    "bWPMSSsVdPk",
    "hrZqiCUx6kg"
  ],
  JAVASCRIPT: [
    "fGdd9qNwQdQ",
    "fju9ii8YsGs",
    "yQaAGmHNn9s"
  ],
  SQL: [
    "yPu6qV5byu4",
    "pJCyTBkoIKA",
    "nWeW3sCmD2k"
  ]
}

const getYoutubeVideoMetadata = (videoId) => {
  const YOUTUBE_API_KEY = 'AIzaSyCSQYRZ0R6X2BWtGK96Sm_FbYaId2oDUuo'
  const apiUrl = `https://content.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${'AIzaSyCSQYRZ0R6X2BWtGK96Sm_FbYaId2oDUuo'}`

  return axios.get(apiUrl)
  .then(res => {
    const video = res.data.items[0].snippet
    return {
      description: video.description,
      thumbnail: (video.thumbnails.high || video.thumbnails.standard).url,
      title: video.title,
      url: 'https://www.youtube.com/watch?v=' + videoId
    }
  })
}

module.exports = {
  getRandomVideo: (category) => {
    const videoId = _.sample(videos[category])
    return getYoutubeVideoMetadata(videoId)
  }
}