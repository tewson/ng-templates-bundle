/* global describe it before */

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
