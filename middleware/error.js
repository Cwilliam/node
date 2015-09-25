exports.notFound = function(req, res, next){
	res.status(404);
	res.render('error', {error: 'Página não encontrada.'});
};

exports.serverError = function(error, req, res, next){
	res.status(505);
	res.render('error',{error: 'Ocorreu um erro '});
};
