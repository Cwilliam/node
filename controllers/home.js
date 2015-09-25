module.exports = function(app){

	HomeController = {
		index: function(req, res){
			res.render('home/index', {res: req.query.res});
		}
	};
	return HomeController;
};