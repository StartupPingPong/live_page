Teams = new Mongo.Collection("teams");
Games = new Mongo.Collection("games");
LiveGame = new Mongo.Collection('livegame');

if (Meteor.isClient) {
	Template.newgame.helpers({
		teams: function () {
			return Teams.find();
		}
	});

	Template.newgame.events({

		'submit form' : function(event, template) {
			event.preventDefault();
			var teamOne = event.target.teamOne.value;
			var teamTwo = event.target.teamTwo.value;
			var gameType = event.target.gameType.value;
			var eventLocation = event.target.eventLocation.value;
			Games.insert({
				createdAt: new Date(),
				teamOne: teamOne,
				teamOneScore: 0,
				teamTwo: teamTwo,
				teamTwoScore: 0,
				gameType: gameType,
				eventLocation: eventLocation,
				status: "preGame"
			});
			Router.go('/adderollen/game');
		}
	});

	Template.teamlist.helpers({
		teams: function () {
			return Teams.find();
		}
	});

	Template.adminGameList.helpers({
		games: function() {
			return Games.find();
		},
		groupStageGames: function(eventLocation) {
			return Games.find({gameType: "Groupstage", eventLocation: eventLocation})
		},
		quarterFinalGames: function(eventLocation) {
			return Games.find({gameType: "Quarterfinal", eventLocation: eventLocation})
		},
		semiFinalGames: function(eventLocation) {
			return Games.find({gameType: "Semifinal", eventLocation: eventLocation})
		},
		finalGames: function(eventLocation) {
			return Games.find({gameType: "Grandfinal", eventLocation: eventLocation})
		},
		currentLocation: function() {
			return Session.get('eventLocation');
		}
	});

	Template.adminGameList.events({
		'click a.location': function(event, template) {
			var eventLocation = $(event.target).data('location');
			Session.set('eventLocation', eventLocation);
		},
		'click input.delete': function () {
			Games.remove(this._id);
		},

		'click input.start': function(event, template) {
			var gameID = $(event.target).data('id');
			var liveGame = Games.findOne(gameID);
			Meteor.call('clearLive');
			LiveGame.insert({
				createdAt: new Date(),
				teamOne: liveGame.teamOne,
				teamOneScore: 0,
				teamTwo: liveGame.teamTwo,
				teamTwoScore: 0,
				gameType: liveGame.gameType,
				eventLocation: liveGame.eventLocation,
			});
			Router.go("/adderollen/live");
		},

		'click a.status': function(event, template) {
			var status = $(event.target).data('status');
			Games.update({_id: this._id}, {$set: {status: status}});
		}
	});

	Template.adminGameList.helpers({
		livegame: function() {
			return LiveGame.find({});
		}
	})

	Template.gamelist.helpers({
		games: function() {
			return Games.find();
		},
		groupStageGames: function(eventLocation) {
			return Games.find({gameType: "Groupstage", eventLocation: eventLocation})
		},
		quarterFinalGames: function(eventLocation) {
			return Games.find({gameType: "Quarterfinal", eventLocation: eventLocation})
		},
		semiFinalGames: function(eventLocation) {
			return Games.find({gameType: "Semifinal", eventLocation: eventLocation})
		},
		finalGames: function(eventLocation) {
			return Games.find({gameType: "Grandfinal", eventLocation: eventLocation})
		},
		currentLocation: function() {
			return Session.get('eventLocation');
		}
	});

	Template.gamelist.events({
		'click a': function(event, template) {
			var eventLocation = $(event.target).data('name');
			Session.set('eventLocation', eventLocation);
		}
	});

	Template.live.helpers({
		livegame: function() {
			return LiveGame.findOne();
		}
	});

	Template.adminLive.helpers({
		livegame: function() {
			return LiveGame.findOne();
		}
	});

	Template.adminLive.events({
		'click input.scoreOne': function(event, template) {
			var gameID = $('#idContainer').text();
			LiveGame.update({_id: gameID}, {$inc: {teamOneScore: 1}});
		},

		'click input.scoreTwo': function(event, template) {
			var gameID = $('#idContainer').text();
			LiveGame.update({_id: gameID}, {$inc: {teamTwoScore: 1}});
		}
	})
	
}

if (Meteor.isSever) {

	Meteor.methods({
		clearLive: function() {
			return LiveGame.remove({});
		}			
	});
}

