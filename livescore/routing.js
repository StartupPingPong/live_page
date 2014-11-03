Router.route('/', function() {
	this.render('home');
});

Router.route ('/live', function() {
	this.render('live');
});

Router.route('/live/:_id', function() {
	this.render('liveGame', {
		data: function() {
			templateData = { game: Games.findOne({_id: this.params._id}) };
			console.log(templateData);
			return templateData;
		}});
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

Router.route('/adderollen', function() {
	this.render('admin');
})

Router.route('/adderollen/game', function() {
	this.render('adminGameList');
});

Router.route('/adderollen/live', function() {
	this.render('adminLive');
})

Router.route('/live/:_id/:teamnbr/inc', {where: 'server'})
  .put(function () {
  	if(this.params.teamnbr == 1) {
  		Games.update({id: this.params.id }, {$inc: {teamOneScore: 1}});
  		 this.response.end(this.params.teamnbr + ' got 1 point\n');
  	} else if (this.params.teamnbr == 2) {
  		Games.update({id: this.params.id }, {$inc: {teamTwoScore: 1}});
  		this.response.end(this.params.teamnbr + ' got 1 point\n');
  	}
  });