'use strict';var fs=require('fs');var glob=require('glob');var minify=require('html-minifier').minify;module.exports = function templatize(path){var options=arguments.length <= 1 || arguments[1] === undefined?{}:arguments[1];if(!options.moduleName){options.moduleName = 'templates';}if(!options.standalone){options.standalone = false;}if(typeof options.name !== 'function'){options.name = function(filename){return filename;};}var paths=path;if(!Array.isArray(paths)){paths = [path];}return new Promise(function(resolve,reject){var globPromises=[];var templateCache='angular.module(\'' + options.moduleName + '\'' + (options.standalone?', [ ]':'') + ').run([ \'$templateCache\', function($templateCache) {';paths.forEach(function(filePath){globPromises.push(new Promise(function(resolve){glob(filePath,function(err,files){if(err){return reject(err);}var filePromises=[];files.forEach(function(file){filePromises.push(new Promise(function(resolve,reject){fs.readFile(file,{encoding:'utf8'},function(fhErr,html){if(fhErr){return reject(fhErr);}var minified=minify(html,{removeComments:true,collapseWhitespace:true});minified = minified.replace(/'/g,'\\\'');minified = minified.replace(/\n/g,'\\\n');minified = '$templateCache.put(\'' + options.name(file) + '\', \'' + minified + '\')';templateCache += '\n\t' + minified;resolve();});}));});Promise.all(filePromises).then(resolve);});}));});Promise.all(globPromises).then(function(){templateCache += '\n}])';resolve(templateCache);});});};