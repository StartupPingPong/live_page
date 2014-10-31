Teams = new Mongo.Collection("teams");
Games = new Mongo.Collection("games");

if (Meteor.isClient) {
	Template.newgame.helpers({
		teams: function () {
			return Teams.find();
		}
	});

	Template.newgame.events({
		'submit form': function() {
			var teamOne = event.target.teamOne.value;
			var teamTwo = event.target.teamTwo.value;
			var gameType = event.target.gameType.value;
			Games.insert({
				createdAt: new Date(),
				teamOne: teamOne,
				teamTwo: teamTwo,
				gameType: gameType
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

