var $ = require('jquery')
var render = require('./template.js')

var User = {
	handle: '@bradwestfall',
	img: 'images/brad.png'
}

$(function () {


	function renderTweet(User, message) {

		var theData = {
			User: User,
			message: message
		}

		var html = render.tweet(theData)

		return html
	}

	function renderCompose() {

		var html = render.compose

		return html

	}

	function renderThread(User, message) {

		var theData = {
			tweet: renderTweet(User, message),
			compose: renderCompose()
		}

		var html = render.thread(theData)

		return html
	}


	// var currentUser = {
	// 	id: id,
	// 	img: img,
	// 	handle: handle,
	// 	realName: realName
	// }

	// 1st Function
	/*$('header textarea').click(function () {
		$(this).parent().addClass('expand')
		$(this).attr('maxlength', '140')
	})*/



/*	$.ajax({
		url: 'http://localhost:3000/users/1'
	}).done(function (data) {
		console.log(data)
	})*/

/*	$.get('http://localhost:3000/users')
		.done(function (data) {
			console.log(data)
		})*/

/*	$.ajax({
	    url: 'http://localhost:3000/users',
	    type: 'POST',
	    data: {
	      id: 4,
	      handle: '@ryanmedina',
	      realName: 'Ryan M. Medina',
	      img: 'me_atop_of_mtnEverest.png'
	    }
	}).done(function (data) {
	    console.log(data)
	})*/

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

		console.log(replyTweetLoc.toArray())

		var message = $(this).parents('.compose').find('textarea').val()

		if ($(this).parents('.replies').length) {
			var output = renderTweet(User, message)
			replyTweetLoc.append(output)

		} else {
			var output = renderThread(User, message)
			$('#tweets').append(output)
		}

		$(this).parents('.compose').removeClass('expand')

		$('textarea').val('')

		$('.count').html('140')
		
	})

})