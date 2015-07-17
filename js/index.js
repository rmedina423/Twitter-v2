var $ = require('jquery');
var template = require('./template.js')

var user = {
	id: 4,
    img: "images/ryan.jpg",
    handle: "@ryanmedina",
    realName: "Ryan M. Medina",
}

$(function () {

	var baseUrl = 'http://localhost:3000'

	function getUsers() {
    	return $.get(baseUrl + '/users')
  	}

	function getUserTweets(users) {
		console.log(users);
		users.forEach(function (user) {
			(function (currentUser) {
				$.get(baseUrl + '/users/' + currentUser.id + '/tweets')
					.done(function (userTweets) {
						Tweets(userTweets, currentUser)
					})
			}(user))
		})
	}

	function Tweets(userTweets, currentUser) {
		userTweets.forEach(function (tweet) {
			var userData = {
				handle: currentUser.handle,
				img: currentUser.img
			}

			var message = tweet.message
			var id = tweet.id

			var html = renderThread(userData, message, id)

			$('#tweets').append(html)

			getTweetReplies(tweet.id)


		})
	}

	function getTweetReplies(tweetId) {
			$.get(baseUrl + '/tweets/' + tweetId + '/replies/')
				.done(function (replies) {
					tweetReplies(replies)
				})
	}

	function tweetReplies(replies) {
		replies.forEach(function (reply) {
			$.get(baseUrl + '/users/' + reply.userId)
				.done(function (user) {
					var userData = {
							handle: user.handle,
							img: user.img
						}
					
					var message = reply.message
					var id = reply.tweetId
					var search = $('#tweets').find('#tweet-' + id).siblings('.replies')

					var html = renderTweet(userData, message, id)
					search.append(html)
				})

		})
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
			var replyId = $('.replies').find($('.tweet')).length
			replyId = ++replyId
			var output = renderTweet(user, message, replyId)
			var tweet = btnClicked.parents('.thread').find('.tweet:first-child').attr('id')
			tweetId = tweet.slice(6)

			replyTweetLoc.append(output)

			$.post('http://localhost:3000/replies', {
				id: replyId,
    			userId: user.id,
			    tweetId: tweetId,
			    message: message
			})

		} else {
			var tweetId = $('.thread').length
			tweetId = ++tweetId
			var output = renderThread(user, message, tweetId)

			$('#tweets').append(output)

			$.post('http://localhost:3000/tweets', {
				id: tweetId,
				userId: user.id,
				message: message,
			})
		}

		$(this).parents('.compose').removeClass('expand')

		$('textarea').val('')

		$('.count').html('140')
		
	})

  $.ajax({

  	url: 'http://localhost:3000/users/',
  	type: 'POST',
  	data: {
  		id: 4,
    	img: "images/ryan.jpg",
    	handle: "@ryanmedina",
    	realName: "Ryan M. Medina",
  	}

	})

	// $.ajax({
	// 	url: 'http://localhost:3000/tweets/1',
	// 	type: 'DELETE'
	// })

});