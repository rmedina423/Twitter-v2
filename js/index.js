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
			(function (currentUser) {

				$.get(baseUrl + '/users/' + currentUser.id + '/tweets')
					.done(function (userTweets) {
						userTweets.forEach(function (tweet) {
							var userData = {
								handle: currentUser.handle,
								img: currentUser.img
							}
							var message = tweet.message
							var id = tweet.id

				 			var html = renderThread(userData, message, id)

				 			$('#tweets').append(html)

							getUserReplies(currentUser.id)

						})
					})
			}(user))
		})
	}

	function getUserReplies(userId) {
		// users.forEach(function (user) {
			// console.log(user)
			$.get(baseUrl + '/users/' + userId + '/replies/')
				.done(function (replies) {
					console.log(replies)
					replies.forEach(function (reply) {

						// var userData = {
						// 		handle: user.handle,
						// 		img: user.img
						// 	}
						// var message = reply.message
						// var id = reply.tweetId
						// var search = $('#tweets').find('#tweet-' + id).siblings('.replies')

						// // search.append(renderThread(reply))
						// var html = renderTweet(userData, message, id)

						// search.append(html)

						console.log(reply)

					})
				})
		// })
	}

	getUsers()
		.done(getUserTweets)


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