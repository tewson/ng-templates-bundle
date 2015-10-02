const fs = require("fs");
const glob = require("glob");
const minify = require("html-minifier").minify;

module.exports = function templatize(path, options = { }) {
	if (!options.moduleName) {
		options.moduleName = "templates";
	}
	if (typeof options.name != "function") {
		options.name = filename => filename;
	}

	let paths = path;

	if (!Array.isArray(paths)) {
		paths = [ path ];
	}

	return new Promise((mainResolve, mainReject) => {
		const globPromises = [ ];

		let templateCache = `angular.module("${options.moduleName}").run([ "$templateCache", function($templateCache) {\n\tuse strict;`;

		paths.forEach(filePath => {
			globPromises.push(new Promise(globResolve => {
				glob(filePath, (err, files) => {
					if (err) {
						return mainReject(err);
					}

					const filePromises = [ ];

					files.forEach(file => {
						filePromises.push(new Promise((fhResolve, fhReject) => {
							fs.readFile(file, { encoding: "utf8" }, (fhErr, html) => {
								if (fhErr) {
									return fhReject(fhErr);
								}

								let minified = minify(html, {
									removeComments: true,
									collapseWhitespace: true,
									quoteCharacter: "'"
								});

								minified = minified.replace(/"/g, "\\\"");
								minified = `$templateCache.put("${options.name(file)}", "${minified}");`;
								templateCache += `\n\t${minified}`;

								fhResolve();
							});
						}));
					});

					Promise.all(filePromises).then(globResolve);
				});
			}));
		});

		Promise.all(globPromises).then(() => {
			templateCache += `\n}]);`;
			mainResolve(templateCache);
		});
	});
};
