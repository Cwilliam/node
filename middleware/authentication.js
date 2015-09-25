module.exports = function(req, res, next){

	jwt = require('jsonwebtoken');

	//checa o cabeçalho ou os parâmetros de url para token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	//decode do token
	if(token){

		//verifica e checa o token
		jwt.verify(token, global.superSecret, function(err, decoded){
			if(err){
				return res.render('error',{error: 'Falha na autenticação da sessão'})
			} else {
				//se tudo estiver ok salva a requisição para usar em outras rotas
				req.decoded = decoded;
				next();
			}
		});
	} else {
		//se não tiver token
		//retorna a resposta http(acesso proibido) e um erro
		return res.render('error',{error: 'Autenticação não provida'});
	}
};