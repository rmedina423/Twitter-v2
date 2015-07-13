'use strict';

var Handlebars = require('hbsfy/runtime')

var tweet = require('./../templates/tweet.handlebars')
var compose = require('./../templates/compose.handlebars')
var thread = require('./../templates/thread.handlebars')

module.exports = {
	tweet: tweet,
	compose: compose,
	thread: thread
}