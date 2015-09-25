var express = require('express'),
	app = express(),
	load = require ('express-load'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	morgan = require('morgan'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	error = require('./middleware/error');

//abre conexão com o mongo
mongoose.connect('mongodb://localhost/crud');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(function (req, res, next) {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
   next();
});

global.superSecret = 'superSecret1234';

//Se encarrega de ler a url
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(methodOverride()); // metodo para sobrescrever os métodos post/get/put ...

//Seta o caminho das views, seta a engine das views
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

//Carrega todos os arquivos da pasta models... e cria as variáveis no controller
load('controllers')
	.then('routes')
	.into(app);

app.use(error.notFound);
app.use(error.serverError);

//Roda o servidor
app.listen(3000, function(){
	console.log('rodando');
});