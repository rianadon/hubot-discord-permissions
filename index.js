const path = require('path')

module.exports = (robot) => {
  const scriptsPath = path.resolve(__dirname, 'dist')
  robot.loadFile(scriptsPath, 'discord-permissions.js')
}
