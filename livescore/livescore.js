Teams = new Mongo.Collection("teams");
Games = new Mongo.Collection("games");
			console.log("asf")

if (Meteor.isClient) {
				console.log("asf")

	Template.newgame.helpers({
		teams: function () {
			return Teams.find();
		}
	});

	Template.newgame.events({

		'submit form' : function(event, template) {
			console.log("asf")
			var teamOne = event.target.teamOne.value;
			var teamTwo = event.target.teamTwo.value;
			var gameType = event.target.gameType.value;
			Games.insert({
				createdAt: new Date(),
				teamOne: teamOne,
				teamOneScore: 0,
				teamTwo: teamTwo,
				teamTwoScore: 0,
				gameType: gamelistType
			});
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
		}
	});

	Template.gamelist.events({
		'click input.delete': function () {
			Games.remove(this._id);
		},

		'click input.start': function() {
			Router.go("/live/" + this._id);
		}
	});
}

