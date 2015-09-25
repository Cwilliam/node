
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

//Schema do usuário
var UserSchema = new Schema({
    name: String,
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true, select: false}
});

UserSchema.pre('save', function (next){
   var user = this;

    //faz o hash da senha apenas se a senha do usuario foi mudada ou se ele é novo
    if (!user.isModified('password')) return next();

    //gera o hash
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err);

        //muda a senha para a versão criptografada
        user.password = hash;
        next();
    });
});

//métódo para comparar a senha dada com a senha em hash do banco de dados
UserSchema.methods.comparePassword = function(password) {
  var user = this;
    return bcrypt.compareSync(password, user.password);
};

//retorna o modelo
module.exports = mongoose.model('User', UserSchema);

