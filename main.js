const fs = require('fs')
const path = require('path')
const request = require('./util/request')
const { cookieToJson } = require('./util/index')

let obj = {}
// fs.readdirSync(path.join(__dirname, 'module')).reverse().forEach(file => {
//   if(!file.endsWith('.js')) return
//   let fileModule = require(path.join(__dirname, 'module', file))
//   obj[file.split('.').shift()] = function (data) {
//     if(typeof data.cookie === 'string'){
//       data.cookie = cookieToJson(data.cookie)
//     }
//     return fileModule({
//       ...data,
//       cookie: data.cookie ? data.cookie : {}
//     }, request)
//   }
// })

function importAll(r) {
  r.keys()
    .reverse()
    .forEach((key) => {
      let fileModule = r(`${key}`)
      obj[key.replace(/^\.\//, '').replace(/\.js$/, '')] = function (data) {
        if (typeof data.cookie === 'string') {
          data.cookie = cookieToJson(data.cookie)
        }
        return fileModule(
          {
            ...data,
            cookie: data.cookie ? data.cookie : {},
          },
          request
        )
      }
    })
}
let modules = require.context('./module/', false, /\.js$/)

modules.keys().reverse().forEach(modules)
importAll(modules)

module.exports = obj
