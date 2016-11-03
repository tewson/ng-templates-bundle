/* global describe it before */

var fs = require('fs')
var shell = require('shelljs')
var jsdom = require('jsdom').jsdom

global.document = jsdom('<html><head><script></script></head><body><template-tester></template-tester></body></html>')
global.window = document.defaultView

require('angular/angular')

global.angular = window.angular

require('../tmp/templates.js')

var angular = window.angular
var expect = require('chai').expect

describe('Template module', function () {
  it('should have been registered', function () {
    expect(angular.module('templates')).to.not.be.undefined
    expect(angular.module('templates').name).to.equal('templates')
  })
})

describe('Templated component', function () {
  before(function () {
    angular.module('test', [ 'templates' ])
      .component('templateTester', {
        templateUrl: 'test/template.html'
      })
    angular.bootstrap(document.body, [ 'test' ])
    this.$rootScope = angular.element(document.body).scope().$root
    this.$rootScope.$apply()
  })

  it('should contain template content', function () {
    expect(document.querySelector('body').innerHTML).to.have.string('The quick brown fox jumps over the lazy dog.')
  })
})

describe('Generated template file', function () {
  before(function () {
    this.randomTemplateContent = {}
    this.templatePaths = [
      'tmp/multiple-templates-1.html',
      'tmp/multiple-templates-2.html'
    ]

    this.templatePaths.forEach(function (templateFilePath) {
      this.randomTemplateContent[templateFilePath] = Math.random().toString()
      fs.writeFileSync(templateFilePath, this.randomTemplateContent[templateFilePath])
    }.bind(this))

    shell.exec('./bin/main.js --paths "tmp/multiple-templates*.html" --standalone > tmp/template.js')

    this.generatedTemplate = fs.readFileSync('tmp/template.js').toString()
  })

  it('should create only one module', function () {
    expect((this.generatedTemplate.match(/angular\.module/g) || []).length).to.equal(1)
  })

  it('should contain the template content', function () {
    this.templatePaths.forEach(function (templatePath) {
      var templateContentRegExp = new RegExp(this.randomTemplateContent[templatePath], 'g')
      expect(templateContentRegExp.test(this.generatedTemplate)).to.be.true
    }.bind(this))
  })
})
