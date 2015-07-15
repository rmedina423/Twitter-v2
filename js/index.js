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
	
	$.getJSON('http://localhost:3000/tweets')
		.done(function (tweets) {
			tweets.forEach(function (tweet) {
				/*console.log('tweet ' + tweet.id + ' belongs to user ' + tweet.userId)*/
					$.getJSON('http://localhost:3000/users/' + tweet.userId)
						.done(function (user) {
							/*console.log(user.handle + ' created tweet ' + tweet.message)*/
							var user = {
								handle: user.handle,
								img: user.img
							}
							var message = tweet.message
							var id = tweet.id

							console.log(id)
							$('#tweets').append(renderThread(user, message, id))
						})
			})
		})

/*	$.getJSON('http://localhost:3000/replies')
		.done(function (replies) {
			replies.forEach(function (reply) {
				// console.log('reply ' + reply.id + ' was made by user ' + reply.userId + ' and sent to tweet ' + reply.tweetId)
			})
		})*/

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