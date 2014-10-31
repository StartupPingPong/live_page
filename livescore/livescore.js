Teams = new Mongo.Collection("teams");
Games = new Mongo.Collection("games");

if (Meteor.isClient) {
  Template.body.helpers({
    teams: function () {
      return Teams.find();
    }
  });

  Template.team.events({
  	"click .point": function () {
  		// add one point to the team
  		Teams.update(this._id, {$inc: {liveScore: 1} });
  	}
  });

}

