#!/usr/bin/env node

const templates = require("./ng-templates");

if (process.argv.length < 4) {
	console.log("Usage:\n  ng-templates <module-name> <path> [path] ...");
} else {
	const moduleName = process.argv[2];
	const paths = process.argv.slice(3);

	templates(paths, {
		moduleName: moduleName,
		name(filename) {
			return filename.replace(/^src\//, "");
		}
	}).then(function(files) {
		console.log(files);
	});
}
