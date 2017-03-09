const Promise = require('bluebird')
const _ = require('lodash')
const videos = require('./videos')

const TEXT_CATEGORIES = {
  C: [
    "Oh well, I can C where this is going. Learning C is fun!"
  ],
  'C++': [
    "Let's learn some OOPS programming. C++ is widely used programming language."
  ],
  JAVA: [
    "Java it is! Have fun playing with your classes and objects."
  ],
  PYTHON: [
    "Here's Python for you. Let's keep it simple and straight-forward!"
  ],
  HTML: [
    "Want to learn how to build a website? Here's your first step."
  ],
  JAVASCRIPT: [
    "Very essential to learn Javascript. Javascript rocks. Good choice buddy!"
  ],
  SQL: [
    "Time for some table talk! SQL is in demand all the time. Have fun learning!"
  ]
  
}

const pickCategory = {
  quick_replies: [
    {
      content_type: 'text',
      title: '💻 C 💻',
      payload: 'GET_VIDEO_C'
    },
    {
      content_type: 'text',
      title: '💻 C++ 💻',
      payload: 'GET_VIDEO_C++'
    },
    {
      content_type: 'text',
      title: '💻 JAVA 💻',
      payload: 'GET_VIDEO_JAVA'
    },
	{
      content_type: 'text',
      title: '💻 PYTHON 💻',
      payload: 'GET_VIDEO_PYTHON'
    },
	{
      content_type: 'text',
      title: '💻 HTML 💻',
      payload: 'GET_VIDEO_HTML'
    },
	{
      content_type: 'text',
      title: '💻 JAVASCRIPT 💻',
      payload: 'GET_VIDEO_JAVASCRIPT'
    },
	{
      content_type: 'text',
      title: '💻 SQL 💻',
      payload: 'GET_VIDEO_SQL'
    }
  ],
  typing: true
}

module.exports = function(bp) {

  bp.middlewares.load()

  bp.hear({
    type: 'postback',
    text: 'GET_STARTED'
  }, (event, next) => {
    const { first_name, last_name } = event.user
    bp.logger.info('New user:', first_name, last_name)

    const WELCOME_SENTENCES = [
      "Hey there..!! I am here to help you learn coding.",
      "Your Coding tutor.",
      "Let me tell you, I don't talk much.",
      "I'm a bit dumb, to be honest. Let's just stick to using buttons, that's going to be easier for the both of us."
    ]

    const WELCOME_TEXT_QUICK_REPLY = "THAT BEING SAID, choose a programming language right away and I'll make sure you get to learn!"

    Promise.mapSeries(WELCOME_SENTENCES, txt => {
      bp.messenger.sendText(event.user.id, txt, { typing: true })
      return Promise.delay(4000)
    })
    .then(() => {
      bp.messenger.sendText(event.user.id, WELCOME_TEXT_QUICK_REPLY, pickCategory)
    })
  })

  const hearGetVideo = category => {
    bp.hear({ text: 'GET_VIDEO_' + category }, (event, next) => {
      console.log('!! I CAUGHT THAT')
      const text = _.sample(TEXT_CATEGORIES[category])
      bp.messenger.sendText(event.user.id, text, { typing: true })

      Promise.delay(1500)
      .then(() => videos.getRandomVideo(category))
      .then(meta => {
        bp.messenger.sendTemplate(event.user.id, {
          template_type: 'generic',
          elements: [{
            title: meta.title,
            item_url: meta.url,
            image_url: meta.thumbnail,
            subtitle: meta.description,
            buttons: [
              { type: 'web_url', title: ' Watch ', url: meta.url },
              { type: 'element_share' }
            ]
          }]
        })
      })
    })
  }

  _.keys(TEXT_CATEGORIES).forEach(hearGetVideo)
  
  bp.botDefaultResponse = event => {
    const text = event.user.first_name + ", I told you, I'm a bit dumb. I assume you want to learn coding, cause that's all I'm able to do :)"
    bp.messenger.sendText(event.user.id, text, pickCategory)
  }
}