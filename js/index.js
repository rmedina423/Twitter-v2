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
	
/*	$.getJSON('http://localhost:3000/tweets')
		.done(function (tweets) {
			tweets.forEach(function (tweet) {
				// console.log('tweet ' + tweet.id + ' belongs to user ' + tweet.userId)
					$.getJSON('http://localhost:3000/users/' + tweet.userId)
						.done(function (user) {
							// console.log(user.handle + ' created tweet ' + tweet.message)
							var user = {
								handle: user.handle,
								img: user.img
							}
							var message = tweet.message
							var id = tweet.id

							$('#tweets').append(renderThread(user, message, id))
						})
			})
		})*/

	var baseUrl = 'http://localhost:3000'

	function getUsers() {
    	return $.get(baseUrl + '/users')
  	}

/*  	function getTweets(userTweets) {
  		userTweets.forEach(function (tweet) {
  			var userData = {
  					handle: user.handle,
					img: user.img
					}
			var message = tweet.message
			var id = tweet.id
  		})
  	}*/

	function getUserTweets(users) {
		users.forEach(function (user) {
			// console.log('user data', user)
			$.get(baseUrl + '/users/' + user.id + '/tweets')
			.done(function (userTweets) {
				userTweets.forEach(function (tweet) {
					var userData = {
						handle: user.handle,
						img: user.img
					}
					var message = tweet.message
					var id = tweet.id

		 			$('#tweets').append(renderThread(userData, message, id))
 					getUserReplies(users)
				})
			})
			.fail(function (xhr) {
				console.log('user ' + user.id + ' posts request failed', xhr.status)
			})
		})
	}

	function getUserReplies(users) {
		users.forEach(function (user) {
			$.get(baseUrl + '/users/' + user.id + '/replies/')
				.done(function (replies) {
					replies.forEach(function (reply) {

						var userData = {
								handle: user.handle,
								img: user.img
							}
						var message = reply.message
						var search = $('#tweets').find('#tweet-' + reply.tweetId).siblings('.replies')

						// search.append(renderThread(reply))
						search.append(renderTweet(userData, message))


					})
				})
		})
	}

	 getUsers()
	    .done(getUserTweets)

	   //  .fail(function (xhr) {
	   //  	console.log('users request failed', xhr.status)
    // })

		// $.get('http://localhost:3000/users')
		// 	.done(function (users) {
		// 		users.forEach(function (user) {
		// 			$.get('http://localhost:3000/users/' + user.id + '/tweets')
		// 				.done(function (userTweets) {
		// 					userTweets.forEach(function (tweet) {
		// 						// console.log(user.handle + ' created tweet ' + tweet.message)

		// 						var userData = {
		// 							handle: user.handle,
		// 							img: user.img
		// 						}
		// 						var message = tweet.message
		// 						var id = tweet.id

		// 						$('#tweets').append(renderThread(userData, message, id))
		// 					})
		// 			$.get('http://localhost:3000/replies')
		// 				.done(function (replies) {
		// 					replies.forEach(function (reply) {
		// 						console.log(reply)
		// 						// console.log('reply ' + reply.id + ' was made by user ' + reply.userId + ' and sent to tweet ' + reply.tweetId)
		// 						var search = $('#tweets').find('#tweet-' + reply.userId)

		// 						console.log(search)

		// 						// search.append(reply)
		// 					})
		// 				})
		// 			})
		// 		})
		// })
	


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