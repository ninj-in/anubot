const { ACTIVITIES, EMOJIS } = require('./constants')

exports.pickRandom = arr => arr[Math.floor(Math.random() * arr.length)]

exports.emoji = name => EMOJIS[name] || global.client.emojis.find(e => e.name === name) || name

exports.setActivity = () => global.client.user.setActivity(...exports.pickRandom(ACTIVITIES))

exports.percentage = n => (Math.round(10000 * n) / 100).toFixed(2)

exports.win = m => m.result === 'W'

exports.loss = m => m.result === 'L'

exports.draw = m => m.result === 'D'

exports.humanizedResult = m => exports.win(m) ? 'win' : exports.draw(m) ? 'draw' : 'loss'