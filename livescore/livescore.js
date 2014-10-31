Teams = new Mongo.Collection("teams");
Games = new Mongo.Collection("games");

if (Meteor.isClient) {
  Template.body.helpers({
    teams: function () {
      return Teams.find();
    }
  });
}

