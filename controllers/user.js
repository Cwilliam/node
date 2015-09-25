module.exports = function(app) {

	/*
		1 = usuário criado com sucesso
		2 = usuário duplicado
		3 = usuário atualizado com sucesso
		4 = usuário deletado
		5 = erros gerais
	*/

	var User = require('./../models/user'),
 		jwt = require('jsonwebtoken');
	
	userController = {

		//renderiza a página index
		index: function(req, res){
			User.find(function (err, users){
				res.render('user/index', {users: users, token: req.query.token, res: req.query.res});
			});
		},

		//renderiza a página add-user
		add: function(req, res){
			res.render('user/add-user',{token: req.body.token, res: req.query.res});
		},

		//adiciona um novo usuário
		addUser: function(req, res){
			//res.send('teste');
			//cria um usuário
			var user = new User();

			user.name = req.body.name;
			user.username = req.body.username;
			user.password = req.body.password;

			user.save(function (err){
				if (err){
					//nomes duplicados
					if (err.code == 11000)
						return res.redirect('/user/add?token='+ req.body.token +'&res=2');//return res.json({ success: false, message: 'Usuário existe' });
					else 
						return res.send(err);
				}
				//res.json({ message: 'Usuário criado' })
				res.redirect('/user?token='+ req.body.token +'&res=1');
			}); 

		},

		//renderiza a página edit-user
		edit: function(req, res){
			User.findById(req.params.user_id, function(err, user){
				if (err) return res.render('error',{error: 'Usuário não encontrado'});
				//retorna o usuário
				res.render('user/edit-user', {user: user, token: req.query.token, res: req.query.res});
			});
		},

		//edita um usuário
		editUser: function(req, res){
			User.findById(req.params.user_id, function(err, user){
				if (err) return res.send(err);

				//Atualiza o usuário 
				if(req.body.name) user.name = req.body.name;
				if(req.body.username) user.username = req.body.username;
				if(req.body.password) user.password = req.body.password;

				//atualiza o usuário
				user.save(function (err){
					if (err.code == 11000) return res.redirect('/user/edit/'+ req.params.user_id+'?token='+ req.body.token+'&res=2');
					res.redirect('/user?token'+ req.body.token +'&res=3');//res.json({ message: 'Usuário atualizado'});
				});
			});
		},

		//deleta um usuário
		deleteUser: function(req, res){
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) return res.send(err);
				res.redirect('/user?token='+ req.query.token+'&res=4')//res.json({ message: 'Deletado' });
			});
		},

		login: function(req, res, next){
			//Acha o usuário
			User.findOne({ username: req.body.username }).select('name username password').exec(function(err, user){

				//Se o usuário não for encontrado
				if(!user){ 
					//res.json({ success: false, message: 'Usuário não existe' }); 
					res.redirect('/home/?res=2');
				} else if(user) {
					//checa se as senhas batem
					var validPassword = user.comparePassword(req.body.password);
					if(!validPassword){
						//res.json({ success: false, message: 'Senha errada' });
						res.redirect('/home/?res=1');
					} else {
						//se o usuário for encontrado e a senha estiver correta criamos o token
						var token = jwt.sign({
							name: user.name,
							username: user.username
						}, global.superSecret, {
							expiresInMinutes: 1440
						});

						res.redirect('/user/?token='+token);
					}
				}

			});
		},

		logout: function(req, res){
			jwt.sign({
				logout: 'logout'
			}, 'logout', {expiresInMinutes: 0});
		}
	};
	return userController;
};