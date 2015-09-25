module.exports = function(app){

	var homeController = app.controllers.home;

	app.route('/home')
		.get(homeController.index);
}