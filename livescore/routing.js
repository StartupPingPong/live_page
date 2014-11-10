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

Router.route('/game/edit/:_id', function() {
	this.render('editGame', { 
		data: function() {
			templateData = { game: Games.findOne({_id: this.params._id}) };
			return templateData;
		}});
});

Router.route('/game/notstarted', function() {
	console.log("final");
	this.render('notStartedGame');
});

Router.route('/game/:_id', function() {
	this.render('viewGame', {
		data: function() {
			templateData = { game: Games.findOne({_id: this.params._id}) };
			return templateData;
		}});
});

Router.route('/admin', function() {
	this.render('admin');
});

Router.route('/admin/game', function() {
	Session.set('eventLocation', 'pustervik');
	this.render('adminGameList');
});

Router.route('/admin/live', function() {
	this.render('adminLive');
});

Router.route('/admin/team', function() {
	this.render('adminTeam');
});	

Router.route('admin/team/new', function() {
	this.render('createTeam');
});

Router.route('admin/rolenisawesome', function() {
	this.render('adminLogin');
})
