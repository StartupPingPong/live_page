Teams = new Mongo.Collection("teams");
Games = new Mongo.Collection("games");

Meteor.startup(function() {
	if(Meteor.isClient) {
		return SEO.config({
			title: 'Startup Ping Pong Livescore',
			meta: {
				'description': 'Startup Ping Pong is a table tennis league where startups compete of being the national Startup Ping Pong master.'
			},
			og: {
				'image': 'http://supp.meteor.com/fb-img.jpg',
				'image:type': 'image/png',
				'image:width': '1200',
				'image:height': '630'
			}
		});
	}
});

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

		'click input.deactivate': function(event, template) {
			var oldGame = Games.findOne({active: true});
			if(oldGame) {
				Games.update({_id: oldGame._id}, {$set: {active: false}});
				$(event.target).attr('value', 'Game Deactivated!')
			} else {
				$(event.target).attr('value', 'No active game!')
			}
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
		Games.update({_id: gameID}, {$inc: {teamOneScore: -1}});
	},

	'click input.scoreTwo': function(event, template) {
		var gameID = $('#liveGameID').text();
		Games.update({_id: gameID}, {$inc: {teamTwoScore: 1}});
	},

	'click input.decTwo': function(event, template) {
		var gameID = $('#liveGameID').text();
		Games.update({_id: gameID}, {$inc: {teamTwoScore: -1}});
	},

	'click input.setOne': function(event, template) {
		var gameID = $('#liveGameID').text();
		Games.update({_id: gameID}, {$inc: {teamOneSetScore: 1}});
	},

	'click input.decSetOne': function(event, template) {
		var gameID = $('#liveGameID').text();
		Games.update({_id: gameID}, {$inc: {teamOneSetScore: -1}});
	},

	'click input.setTwo': function(event, template) {
		var gameID = $('#liveGameID').text();
		Games.update({_id: gameID}, {$inc: {teamTwoSetScore: 1}});
	},

	'click input.decSetTwo': function(event, template) {
		var gameID = $('#liveGameID').text();
		Games.update({_id: gameID}, {$inc: {teamTwoSetScore: -1}});
	},

	'click input.newSet': function(event, template) {
		var gameID = $('#liveGameID').text();
		var teamOneScore = parseInt($('#teamOneScore').text());
		var teamTwoScore = parseInt($('#teamTwoScore').text());
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

Template.viewGame.helpers({
	location: function(locationName) {
		if (locationName == "pustervik") {
			return "Pustervik"
		} else if(locationName == "push") {
			return "PUSH"
		}
	}
})

Template.teamListItem.helpers({
})

Template.adminTeam.helpers({
	teams: function() {
		return Teams.find({}, {sort: {totalScore: -1}});
	}
});

Template.adminTeam.events({
	'click input.inc-point': function(event, template) {
		var teamID = $(event.target).attr('id');
		Teams.update({_id: teamID}, {$inc: {totalScore: 1}})
	},

	'click input.dec-point': function(event, template) {
		var teamID = $(event.target).attr('id');
		var score = Teams.findOne(teamID).totalScore;
		if(score > 0) {
			Teams.update({_id: teamID}, {$inc: {totalScore: -1}})
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


