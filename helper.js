var UserClass = require('./database/models/models').getClass("User");
var Helper ={};
//帐号密码验证，验证正确返回数据库中的user
Helper.authenticate = function (name, pass, fn) {
    UserClass.findOne({
        username: name
    },
    function (err, user) {
        if (user) {
            if (err) return fn(new Error('cannot find user'));
            user.comparePassword(pass,function (err, isMatch) {
                if (err) return fn(err);
                if (isMatch) return fn(null, user);
                fn(new Error('invalid password'));
            });
        } else {
            return fn(new Error('cannot find user'));
        }
    });

}

//判断用户是否已经存在
//false 不存在
Helper.userExist = function(username, fn) {
    UserClass.count({
        username: username
    }, function (err, count) {
        if(err){
            fn(err);
            return ;
        }
        if (count !== 0) {
            fn("User Exist",true);
            return ;
        } else {
           fn(null,false);
        }
    });
}

var ADMIN_ROLE = 'admin';
//检测要处理的表是否是用户表
//只有管理员有权限处理用户表
Helper.noUserClassAuth = function(className, req, res){
    var user = req.session.user;
    if(className=="User"&&(user==null||user.role!=ADMIN_ROLE)){
        res.status(500).send({error:"没有权限!"});
        return true;
    }
    return false;
}
//需要管理员权限
Helper.adminAuth = function(req,res,next){
    var user = req.session.user;
    if(user!=null&&user.role===ADMIN_ROLE){
        next();
    }
    else {
        res.status(500).send({error:"没有权限!"});
        res.end();
    }
}

//需要登录
Helper.requiredAuthentication = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(500).send({error:"请先登录!"});
        res.end();
    }
}



module.exports = Helper;