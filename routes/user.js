module.exports = function(app){

	var userController = app.controllers.user,
		auth = require('./../middleware/authentication');

	app.post('/login', userController.login);
	app.get('/logout', userController.logout);

	app.all('*', auth);

	app.get('/user', userController.index);
	app.route('/user/add')
		.get(userController.add)
		.post(userController.addUser);
	
	app.get('/user/delete/:user_id', userController.deleteUser);

	app.route('/user/edit/:user_id')
		.get(userController.edit)
		.post(userController.editUser);


}; 