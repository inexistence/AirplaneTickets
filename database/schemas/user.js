var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    pbkdf2 = require('pbkdf2'),
    SALT_LENGTH = 32;
var algorithm = 'sha256';
var iterations = 1;
var keylen = 20;

var BaseSchema = require('./baseschema');

var _ = require('underscore');
//用户数据结构
var UserSchema = new mongoose.Schema(_.extend({
	role: String,//角色
	username: { //用户名
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	password: { //密码
		type: String,
		required: true
	},
	salt:String,//salt
	email:String,//邮箱
	phoneNumber:String//手机号
},BaseSchema.data));



//每次存储数据前都会调用这个方法
UserSchema.pre('save', function(next) {
	BaseSchema.preSave(this);
    var user = this;
	
    //产生密码hash  当密码有更改的时候(或者是新密码)
    if (!user.isModified('password')) return next();
    //产生salt
    var salt = pbkdf2.generateSaltSync(SALT_LENGTH);
    //产生hash
    var hash = pbkdf2.hashSync(user.password, salt, iterations, keylen, algorithm);
    // 使用hash覆盖明文密码
    user.password = hash;
    user.salt = salt;
    next();
}); 

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    var isMatch = pbkdf2.compareSync(this.password, candidatePassword, this.salt, iterations, keylen, algorithm);
    cb(null, isMatch);
};

//静态函数
UserSchema.statics = BaseSchema.statics;

module.exports = UserSchema;