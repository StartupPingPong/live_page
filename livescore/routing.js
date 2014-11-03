Router.route('/', function() {
	this.render('home');
});

Router.route('/total', function() {
	this.render('totalScore');
});

Router.route ('/live', function() {
	this.render('live');
});

Router.route('/game', function() {
	Session.set('eventLocation', 'pustervik');
	this.render('gamelist');
});

Router.route('/game/new', function() {
	this.render('newgame');
});

Router.route('/game/:_id', function() {
	this.render('viewGame', {
		data: function() {
			templateData = { game: Games.findOne({_id: this.params._id}) };
			return templateData;
		}});
});

Router.route('/adderollen', function() {
	this.render('admin');
})

Router.route('/adderollen/game', function() {
	Session.set('eventLocation', 'pustervik');
	this.render('adminGameList');
});

Router.route('/adderollen/live', function() {
	this.render('adminLive');
});

Router.route('/adderollen/total', function() {
	this.render('adminTotalScore');
});	

Router.route('adderollen/team/new', function() {
	this.render('createTeam');
});
