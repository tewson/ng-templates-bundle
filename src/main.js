#!/usr/bin/env node

const flags = require("flags");
const templates = require("./ng-templates");

flags.usageInfo = "Usage:\n  ng-templates [options] <path> [path] ...";
flags.defineString("moduleName", "ng-templates", "The name of the module to contain template cache");
flags.defineString("paths", [ "*.html" ], "Paths to HTML files");
flags.defineBoolean("standalone", false, "Whether the module being used is standalone");
flags.defineString("filenamePrefix", "", "A prefix to apply to filenames");
flags.parse();

if (process.argv.length < 3) {
	flags.help();
} else {
	const nameFn = flags.get("filenamePrefix") ? n => `${flags.get("filenamePrefix")}${n}` : n => n;

	templates(flags.get("paths"), {
		moduleName: flags.get("moduleName"),
		standalone: flags.get("standalone"),
		name: nameFn
	}).then(function(files) {
		console.log(files);
	});
}
