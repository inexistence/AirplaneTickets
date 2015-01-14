var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var BaseSchema = require('./baseschema');

var _ = require('underscore');
//用户数据结构
var UserSchema = new mongoose.Schema(_.extend({
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
	email:String,//邮箱
	phoneNumber:String//手机号
},BaseSchema.data));

//每次存储数据前都会调用这个方法
UserSchema.pre('save', function(next) {
	BaseSchema.preSave(this);
    var user = this;

    //产生密码hash当密码有更改的时候(或者是新密码)
    if (!user.isModified('password')) return next();

    // 产生一个salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        //  结合salt产生新的hash
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // 使用hash覆盖明文密码
            user.password = hash;
            next();
        });
    });
}); 

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//静态函数
UserSchema.statics = BaseSchema.statics;

module.exports = UserSchema;