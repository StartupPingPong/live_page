Teams = new Mongo.Collection("teams");
Games = new Mongo.Collection("games");
			
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
				eventLocation: eventLocation
			});
			Router.go('/game');
		}
	});

	Template.teamlist.helpers({
		teams: function () {
			return Teams.find();
		}
	});

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
	})

	Template.gamelist.events({
		'click input.delete': function () {
			Games.remove(this._id);
		},

		'click input.start': function() {
			Router.go("/live/" + this._id);
		}
	});
}

