Teams = new Mongo.Collection("teams");
Games = new Mongo.Collection("games");


if (Meteor.isClient) {
	Template.newgame.helpers({
		teams: function () {
			return Teams.find();
		}
	});

	Template.header.events({
		'click a': function(event, template) {
			$('.header-link').removeClass('currentLink');
			$(event.target).addClass('currentLink');
		}
	})

	Template.newgame.events({

		'submit form' : function(event, template) {
			event.preventDefault();
			var teamOne = Teams.findOne({name: event.target.teamOne.value});
			var teamTwo = Teams.findOne({name: event.target.teamTwo.value});
			var gameType = event.target.gameType.value;
			var eventLocation = event.target.eventLocation.value;
			var sets = event.target.sets.value;
			Games.insert({
				createdAt: new Date(),
				teamOne: teamOne.name,
				teamOneID: teamOne._id,
				teamOneScore: 0,
				teamOneSetScore: 0,
				teamTwo: teamTwo.name,
				teamTwoID: teamTwo._id,
				teamTwoScore: 0,
				teamTwoSetScore: 0,
				gameType: gameType,
				eventLocation: eventLocation,
				status: "preGame",
				active: false,
				sets: sets
			});
			Router.go('/admin/game');
		}
	});

	Template.editGame.helpers({
		teams: function() {
			return Teams.find();
		},

		isSelected: function(valueOne, valueTwo) {
			if (valueOne == valueTwo) {
				return "Selected";
			} else {
				return "";
			}
		},

		isChecked: function(valueOne, valueTwo) {
			if (valueOne == valueTwo) {
				return "Checked";
			} else {
				return "";
			}	
		}
	});

	Template.editGame.events({
		'submit form' : function(event, template) {
			event.preventDefault();
			var gameID = event.target.gameID.value;
			var teamOne = Teams.findOne({name: event.target.teamOne.value});
			var teamOneScore = event.target.teamOneScore.value;
			var teamTwo = Teams.findOne({name: event.target.teamTwo.value});
			var teamTwoScore = event.target.teamTwoScore.value;
			var gameType = event.target.gameType.value;
			var eventLocation = event.target.eventLocation.value;
			var status = event.target.status.value;
			var sets = event.target.sets.value;
			Games.update({_id: gameID}, {$set:
				{teamOne: teamOne.name,
					teamOneID: teamOne._id,
					teamOneScore: teamOneScore,
					teamTwo: teamTwo.name,
					teamTwoID: teamTwo._id,
					teamTwoScore: teamTwoScore,
					gameType: gameType,
					eventLocation: eventLocation,
					status: status,
					sets: sets}
				});
			Router.go('/admin/game');
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
		},

		currentLocation: function() {
			return Session.get('eventLocation');
		},

		isCurrentLocation: function(locationOne, locationTwo) {
			if (locationOne == locationTwo) {
				return "current-location";
			} else {
				return "";
			}
		}
	});

	Template.adminGameList.events({
		'click a.location': function(event, template) {
			var eventLocation = $(event.target).data('name');
			Session.set('eventLocation', eventLocation);
		},
		'click input.delete': function () {
			Games.remove(this._id);
		},

		'click input.activate': function(event, template) {
			var gameID = $(event.target).data('id');
			var oldGame = Games.findOne({active: true});
			if(oldGame) {
				Games.update({_id: oldGame._id}, {$set: {active: false}});
			}
			Games.update({_id: gameID}, {$set: {active: true}});
			Router.go("/admin/live");
		},

		'click a.status': function(event, template) {
			var status = $(event.target).data('status');
			Games.update({_id: this._id}, {$set: {status: status}});
		}
	});

	Template.gamelist.helpers({
		games: function() {
			return Games.find();
		},
		groupStageGames: function(eventLocation) {
			var result = Games.find({gameType: "Groupstage", eventLocation: eventLocation})
			console.log(result)
			return result;
		},

		findGames: function(gameType, eventLocation) {
			var result = Games.find({gameType: gameType+"final", eventLocation: eventLocation}).fetch();
			var dummyCount = result.length + 1;
			var maxCount = 0;
			switch (gameType) {
				case "Quarter":
				maxCount = 5;
				break;
				case "Semi":
				maxCount = 3;
				break;
				case "Grand":
				maxCount = 2;
				break;
			}
			if(result.length < maxCount) {
				while(dummyCount < maxCount) {
					var dummy = {
						_id: gameType+"final"+dummyCount,
						active: false,
						createdAt: new Date(),
						eventLocation: eventLocation,
						status: "pre",
						teamOne: gameType+" Finalist #" + ((dummyCount*2)-1),
						teamOneID: gameType+"team"+((dummyCount*2)-1),
						teamOneScore: 0,
						teamTwo: gameType+" Finalist #" + (dummyCount*2),
						teamTwoID: gameType+"team"+dummyCount*2,
						teamTwoScore: 0,
						dummy: true
					}
					result.push(dummy);
					dummyCount++;
				}
			} else if(result.length > (maxCount-1)){
				return result.slice(0,(maxCount-1));
			};
			return result;
		},

		currentLocation: function() {
			return Session.get('eventLocation');
		},

		isCurrentLocation: function(locationOne, locationTwo) {
			if (locationOne == locationTwo) {
				return "current-location";
			} else {
				return "";
			}
		}
	});

Template.gamelist.events({
	'click a': function(event, template) {
		var eventLocation = $(event.target).data('name');
		Session.set('eventLocation', eventLocation);
	},

	'mouseover .team-item': function(event, template) {
		var teamID = $(event.target).data('id');
		$('.' + teamID).addClass("mouse-on");
	},

	'mouseleave .team-item': function(event, template) {
		var teamID = $(event.target).data('id');
		$('.' + teamID).removeClass("mouse-on");
	}
});

Template.live.helpers({
	livegame: function() {
		return Games.findOne({active: true});
	}
});

Template.adminLive.helpers({
	livegame: function() {
		return Games.findOne({active: true});
	}
});

Template.adminLive.events({
	'click input.scoreOne': function(event, template) {
		var gameID = $('#liveGameID').text();
		Games.update({_id: gameID}, {$inc: {teamOneScore: 1}});
	},

	'click input.decOne': function(event, template) {
		var gameID = $('#liveGameID').text();
		var teamOneScore = $('#teamOneScore').text();
		Games.update({_id: gameID}, {$set: {teamOneScore: teamOneScore-1}});
	},

	'click input.scoreTwo': function(event, template) {
		var gameID = $('#liveGameID').text();
		Games.update({_id: gameID}, {$inc: {teamTwoScore: 1}});
	},

	'click input.decTwo': function(event, template) {
		var gameID = $('#liveGameID').text();
		var teamTwoScore = $('#teamTwoScore').text();
		Games.update({_id: gameID}, {$set: {teamTwoScore: teamTwoScore-1}});
	},

	'click input.setOne': function(event, template) {
		var gameID = $('#liveGameID').text();
		Games.update({_id: gameID}, {$inc: {teamOneSetScore: 1}});
	},

	'click input.decSetOne': function(event, template) {
		var gameID = $('#liveGameID').text();
		var teamOneSetScore = $('#teamOneSetScore').text();
		Games.update({_id: gameID}, {$set: {teamOneSetScore: teamOneSetScore-1}});
	},

	'click input.setTwo': function(event, template) {
		var gameID = $('#liveGameID').text();
		Games.update({_id: gameID}, {$inc: {teamTwoSetScore: 1}});
	},

	'click input.decSetTwo': function(event, template) {
		var gameID = $('#liveGameID').text();
		var teamTwoSetScore = $('#teamTwoSetScore').text();
		Games.update({_id: gameID}, {$set: {teamTwoSetScore: teamTwoSetScore-1}});
	},

	'click input.newSet': function(event, template) {
		var gameID = $('#liveGameID').text();
		var teamOneScore = $('#teamOneScore').text();
		var teamTwoScore = $('#teamTwoScore').text();
		if(teamOneScore > teamTwoScore) {
			Games.update({_id: gameID}, {$inc: {teamOneSetScore: 1}});
		} else if(teamTwoScore > teamOneScore) {
			Games.update({_id: gameID}, {$inc: {teamTwoSetScore: 1}});
		} else {
			console.log('Equal Score!')
		}
		Games.update({_id: gameID}, {$set: {teamOneScore: 0, teamTwoScore: 0}})
	}
});

Template.totalScore.helpers({
	teams: function() {
		return Teams.find({}, {sort: {totalScore: -1}});
	}
});

Template.teamListItem.helpers({
})

Template.adminTeam.helpers({
	teams: function() {
		return Teams.find({}, {sort: {totalScore: -1}});
	}
});

Template.adminTeam.events({
	'click a': function(event, template) {
		var teamID = $(event.target).data('id');
		var newScore = parseInt($(event.target.parentNode.previousElementSibling.lastElementChild).val());
		if(newScore) {
			Teams.update({_id: teamID}, {$set: {totalScore: newScore}});
			$(event.target.parentNode.previousElementSibling.lastElementChild).val('');
		}
	},

	'click input.delete': function(event, template) {
		var teamID = $(event.target).data('id');
		Teams.remove({_id: teamID});
	}
});

Template.createTeam.events({
	'submit form': function(event, template) {
		event.preventDefault();
		var teamName = event.target.teamName.value;
		var teamScore = parseInt(event.target.teamScore.value);
		Teams.insert({
			createdAt: new Date(),
			name: teamName,
			totalScore: teamScore,
			owner: Meteor.userId(),
			username: Meteor.user().username
		});
		Router.go('/admin/team');
	}
});

Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
});

}


