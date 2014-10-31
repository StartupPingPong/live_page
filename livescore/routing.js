Router.route('/', function() {

});

Router.route('/team/:name/inc', {where: 'server'})
  .post(function () {
  	this.response.end(this.params.name + ' got 1 point\n');
  	Teams.update({name: this.params.name}, {$inc: {liveScore: 1} });
  });