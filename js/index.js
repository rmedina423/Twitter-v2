'use strict';

var $ = require('jquery');
var template = require('./template.js');
var baseUrl = 'http://localhost:3000';
var getUsers = $.get(baseUrl + '/users/');
var tweetsContainer = $('#tweets');
var mainContainer = $('#main');
var currentUser = $('#currentUser');

var user = {
	id: 4,
	img: "images/ryan.jpg",
	handle: "@ryanmedina",
	realName: "Ryan M. Medina",
};

$(document).ready(function () {
	getUsers.done(getUserTweets).done(getUserReplies);
	attachEvents();
});

function getUserTweets(users) {
	users.forEach(function (user) {
		$.get(getUserTweetsURL(user.id)).done(function (userTweets) {
			getTweets(userTweets, user);
		});
	});
}

function getUserTweetsURL(userID) {
	return baseUrl + '/users/' + userID + '/tweets';
}

function getTweets(userTweets, user) {
	userTweets.forEach(function (tweet) {
		tweetsContainer.append(renderThread({
			handle: user.handle,
			img: user.img
		}, tweet.message, tweet.id));
	});
}

function getUserReplies(users) {
	users.forEach(function (user) {
		$.get(getUserRepliesURL(user.id)).done(function (replies) {
			replies.forEach(function (reply) {
				if (user.id === reply.userId) {								
					var search = tweetsContainer.find('#tweet-' + reply.tweetId).siblings('.replies');

					search.append(renderTweet({
						handle: user.handle,
						img: user.img
					}, reply.message, reply.tweetId));
				}
			});
		});
	});
}

function getUserRepliesURL(userID) {
	return baseUrl + '/users/' + userID + '/replies/';
}

function renderTweet(user, message, id) {
	return template.tweet({
		user: user,
		id: id,
		message: message
	});
}

function renderThread(user, message, id) {
	return template.thread({
		tweet: renderTweet(user, message, id),
		compose: template.compose
	});
}

function attachEvents() {
	mainContainer.on('click', 'textarea', onClickExpandTextArea);
	currentUser.on('change', onChangeCurrentUser);
	tweetsContainer.on('click','.tweet', onClickExpandTweet);
	mainContainer.on('click', 'button', onClickSendButton);
	mainContainer.on('keyup', 'textarea', onKeyUpTextArea);
}

function onClickExpandTextArea() {
	$(this).parent().addClass('expand');
	$(this).attr('maxlength', '140');
}

function onChangeCurrentUser(event) {

	var selectedUser = $(event.currentTarget).find($(':selected'));

	$.get('http://localhost:3000/users').done(function (users) {
		users.forEach(function (currentUser) {
			if (currentUser.id == selectedUser.attr('value')) {
				user = currentUser;
			}
		});
	});
}

function onClickExpandTweet() {
	$(this).parent().toggleClass('expand');
}

function onClickSendButton(event) {
	event.preventDefault();

	var message = $(this).parents('.compose').find('textarea').val();
	var btnClicked = $(this);
	var replyTweetLoc = btnClicked.parents('.replies');
	var tweet = btnClicked.parents('.thread').find('.tweet:first-child').attr('id');

	if ($(this).parents('.replies').length) {
		replyTweetLoc.append(renderTweet(user, message));
		postToReplies(message, tweet);
	} else {
		tweetsContainer.append(renderThread(user, message));
		postToTweets(message);
	}

	$(this).parents('.compose').removeClass('expand');
	$('textarea').val('');
	$('.count').html('140');
}

function postToReplies(message, tweet) {
	$.post('http://localhost:3000/replies', {
		userId: user.id,
		tweetId: tweet.slice(6),
		message: message
	});
}

function postToTweets(message) {
	$.post('http://localhost:3000/tweets', {
		userId: user.id,
		message: message,
	});
}

function onKeyUpTextArea() {
	var counter = $(this).parent().find('.count');
	counter.text(140 - $(this).val().length);
}