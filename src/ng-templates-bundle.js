const fs = require('fs')
const glob = require('glob')
const minify = require('html-minifier').minify

module.exports = function templatize (path, options = {}) {
  if (!options.moduleName) {
    options.moduleName = 'templates'
  }
  if (!options.standalone) {
    options.standalone = false
  }
  if (typeof options.name !== 'function') {
    options.name = filename => filename
  }

  let paths = path

  if (!Array.isArray(paths)) {
    paths = [path]
  }

  return new Promise((resolve, reject) => {
    const globPromises = []

    let templateCache = `angular.module('${options.moduleName}'${options.standalone ? ', [ ]' : ''}).run([ '$templateCache', function($templateCache) {`

    paths.forEach(filePath => {
      globPromises.push(new Promise(resolve => {
        glob(filePath, (err, files) => {
          if (err) {
            return reject(err)
          }

          const filePromises = []

          files.forEach(file => {
            filePromises.push(new Promise((resolve, reject) => {
              fs.readFile(file, {
                encoding: 'utf8'
              }, (fhErr, html) => {
                if (fhErr) {
                  return reject(fhErr)
                }

                let minified = minify(html, {
                  removeComments: true,
                  collapseWhitespace: true
                })

                minified = minified.replace(/'/g, '\\\'')
                minified = minified.replace(/\n/g, '\\\n')
                minified = `$templateCache.put('${options.name(file)}', '${minified}')`
                templateCache += `\n\t${minified}`

                resolve()
              })
            }))
          })

          Promise.all(filePromises).then(resolve)
        })
      }))
    })

    Promise.all(globPromises).then(() => {
      templateCache += `\n}])`
      resolve(templateCache)
    })
  })
}
