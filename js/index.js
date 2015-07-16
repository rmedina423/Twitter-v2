var $ = require('jquery');
var template = require('./template.js')

$(function () {

	$('#main').on('click', 'textarea', function () {
		$(this).parent().addClass('expand')
		$(this).attr('maxlength', '140')
	})

	$('#tweets').on('click','.tweet', function () {
		$(this).parent().toggleClass('expand')
	})

	var baseUrl = 'http://localhost:3000'

	function getUsers() {
    	return $.get(baseUrl + '/users')
  	}

	function getUserTweets(users) {
		users.forEach(function (user) {
			$.get(baseUrl + '/users/' + user.id + '/tweets')
			.done(function (userTweets) {
				userTweets.forEach(function (tweet) {
					var userData = {
						handle: user.handle,
						img: user.img
					}
					var message = tweet.message
					var id = tweet.id

		 			var html = renderThread(userData, message, id)

		 			$('#tweets').append(html)

				})
			})
		})
	}

	function getUserReplies(users) {
		users.forEach(function (user) {
			// console.log(user)
			$.get(baseUrl + '/users/' + user.id + '/replies/')
				.done(function (replies) {
					replies.forEach(function (reply) {

						var userData = {
								handle: user.handle,
								img: user.img
							}
						var message = reply.message
						var id = reply.tweetId
						var search = $('#tweets').find('#tweet-' + id).siblings('.replies')

						// search.append(renderThread(reply))
						var html = renderTweet(userData, message, id)

						search.append(html)

					})
				})
		})
	}

	getUsers().done(getUserTweets)
	getUsers().done(getUserReplies)


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
});