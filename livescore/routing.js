Router.route ('/live', function() {
	this.render('live');
});

Router.route('/live/:_id', function() {
	var game = Games.findOne({_id: this.params._id});
	this.render('liveGame', {data: game});
});

Router.route('/teamlist', function() {
	this.render('teamlist');
});

Router.route('/game', function() {
	this.render('gamelist');
});

Router.route('/game/new', function() {
	this.render('newgame');
});

Router.route('/game/create', {where: 'server'}).post(function() {

	this.render('gamelist');
});

Router.route('/team/:name/inc', {where: 'server'})
  .put(function () {
  	this.response.end(this.params.name + ' got 1 point\n');
  	Teams.update({name: this.params.name}, {$inc: {liveScore: 1} });
  });