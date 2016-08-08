/* jshint node: true, asi: true */
'use strict'

var $ = require('jquery');
var template = require('./template.js')

var user = {
	id: 4,
	img: "images/ryan.jpg",
	handle: "@ryanmedina",
	realName: "Ryan M. Medina",
}

$(function () {

	$('#currentUser').on('change', function () {
		$.get('http://localhost:3000/users')
			.done(function (users) {
				users.forEach(function (userx) {
					if (userx.id == $('#currentUser').val()) {
						user = userx
					}
				})
			})
	})

	var baseUrl = 'http://localhost:3000'

	var getUsers = $.get(baseUrl + '/users/')

	function getUserTweets(users) {
		users.forEach(function (user) {
			(function (currentUser) {
				$.get(baseUrl + '/users/' + currentUser.id + '/tweets')
					.done(function (userTweets) {
						getTweets(userTweets, currentUser)
					})
			}(user))
		})
	}

	function getTweets(userTweets, currentUser) {
		userTweets.forEach(function (tweet) {
			var userData = {
				handle: currentUser.handle,
				img: currentUser.img
			}

			var message = tweet.message
			var id = tweet.id

			var html = renderThread(userData, message, id)

			$('#tweets').append(html)

		})
	}

	function getUserReplies(users) {
		users.forEach(function (user) {
			$.get(baseUrl + '/users/' + user.id + '/replies/')
				.done(function (replies) {
					replies.forEach(function (reply) {
							if (user.id === reply.userId) {			
								var userData = {
									handle: user.handle,
									img: user.img
								}
								
								var message = reply.message

								var id = reply.tweetId

								var search = $('#tweets').find('#tweet-' + id).siblings('.replies')

								var html = renderTweet(userData, message, id)

								search.append(html)
							}

					})
				})
		})
	}

	function getReplies(replies, tweet) {
					var userData = {
							handle: user.handle,
							img: user.img
						}
					
					var message = reply.message

					var id = reply.tweetId

					var search = $('#tweets').find('#tweet-' + id).siblings('.replies')

					var html = renderTweet(userData, message, id)

					search.append(html)
	}

	getUsers
		.done(getUserTweets)
		.done(getUserReplies)


	function renderTweet(user, message, id) {

		var theData = {
			user: user,
			id: id,
			message: message
		}

		return template.tweet(theData)
	}

	function renderThread(user, message, id) {

		var theData = {
			tweet: renderTweet(user, message, id),
			compose: template.compose
		}

		return template.thread(theData)
	}

	$('#main').on('click', 'textarea', function () {
		$(this).parent().addClass('expand')
		$(this).attr('maxlength', '140')
	})

	$('#tweets').on('click','.tweet', function () {
		$(this).parent().toggleClass('expand')
	})

	$('#main').on('click', 'button', function (event) {
		event.preventDefault()

		var btnClicked = $(this)

		var replyTweetLoc = btnClicked.parents('.replies')

		var message = $(this).parents('.compose').find('textarea').val()


		if ($(this).parents('.replies').length) {

			var output = renderTweet(user, message)
			var tweet = btnClicked.parents('.thread').find('.tweet:first-child').attr('id')

			var tweetId = tweet.slice(6)

			replyTweetLoc.append(output)

			$.post('http://localhost:3000/replies', {
				userId: user.id,
				tweetId: tweetId,
				message: message
			})

		} else {
			var output = renderThread(user, message)

			$('#tweets').append(output)

			$.post('http://localhost:3000/tweets', {
				userId: user.id,
				message: message,
			})
		}

		$(this).parents('.compose').removeClass('expand')

		$('textarea').val('')

		$('.count').html('140')
		
	})

	$('#main').on('keyup', 'textarea', function () {
			var counter = $(this).parent().find('.count')

			var max = 140

			var value = $(this).val()

			counter.text(max-value.length)
		})

});