/* global describe it */

var jsdom = require('jsdom').jsdom

global.document = jsdom('<html><head><script></script></head><body></body></html>')
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
