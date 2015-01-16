//------引用的module------
var express = require('express');
var _ = require('underscore');
//使用mongoose作为数据库
var mongoose = require('mongoose');
//处理post中的data数据
var bodyParser = require('body-parser');
var session = require('express-session'); //如果要使用session，需要单独包含这个模块
var cookieParser = require('cookie-parser'); //如果要使用cookie，需要显式包含这个模块
//-------------------------


//引用自己写的服务端的数据库Module
var Helper = require('./helper.js')
//包含Database.Query&Database.Object
var Database = require('./database/databaseModule');
var Models = require('./database/models/models');

//连接本地数据库airplaneTickets
mongoose.connect('mongodb://localhost/airplaneTickets');

var app = express();


/*
Middlewares and configurations 
*/
app.configure = function () {
    app.use(cookieParser('Authentication Tutorial '));
    app.use(session({
    	resave:false,
    	saveUninitialized:false,
    	secret: 'airplaneticket'
    }));

    //使前端post来的数据能从req.body中取得
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(express.static(__dirname));
	//设置视图根目录
	app.set('views', './views/pages');
	//设置默认模版引擎
	app.set('view engine', 'jade');
};
app.configure();



var port = process.env.PORT || 80;
//监听端口
app.listen(port);

console.log('airplaneTickets started on port '+port);

function getRenderData(req){
	var result = {};
	var user = req.session.user;
	if(user){
		result.user = {username:user.username,role:user.role};
		result.user = JSON.stringify(result.user);
	}
	return result;
}


// 编写路由
app.get('/',function(req, res) {	
	var data = getRenderData(req);
	data.title = '机票查询';
	res.render('index', data);
});

app.get('/ticketDetail/:id',Helper.adminAuth,function(req, res) {
	var id = req.params.id;
	var data = getRenderData(req);
	data.title = '机票详情';
	var date = new Date();
	date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
	data.flight = {
		flightNumber: "",//航班号
		company: "",//公司
		leaveTime:"",//出发时间
		leaveDate:date,//出发日期
		arrTime:"",//到达时间
		arrDate:date,//到达日期
		leaveAirport:"",//出发机场
		leaveCity:"",//出发城市
		arrAirport:"",//到达机场
		arrCity:"",//到达城市
		businessFare:"",//商务舱价格
		businessCount:"0",//商务舱票数
		firstFare:"",//头等舱价格
		firstCount:"0",//头等舱数量
		economyFare:"",//经济舱价格
		economyCount:"0",//经济舱数量		
	}
	if(id != "-1"){
		var query = new Database.Query("Flight");
		query.get(id,{
			success:function(result){
				data.flight = result.attributes;
				res.render('ticketDetail', data);
			},error:function(err){
				res.status(404).send(err);
				res.end();
			}
		})
	}else{
		res.render('ticketDetail', data);
	}
});

app.get('/ticketManage',Helper.adminAuth,function(req, res) {
	var data = getRenderData(req);
	data.title = '机票管理';
	res.render('ticketManage', data);
});

app.get('/newOrder',Helper.requiredAuthentication, function(req,res){
	var id = req.query.flightId;
	var level = req.query.flightLevel;
	if(id==undefined||level==undefined||id=="undefined"||level=="undefined"){
		res.status(404).send("404 not found");
		return ;
	}
	var data = getRenderData(req);
	data.title = '新建订单';
	var query = new Database.Query("Flight");
	query.get(id,{
		success:function(result){
			if(!result||!result.attributes){
				res.status(404).send("404 not found");
				return ;
			}
			if(level == 'business'){
				data.level = '商务舱';
				data.fare = result.attributes.businessFare;
			}
			else if(level == 'economy'){
				data.level = '经济舱';
				data.fare = result.attributes.economyFare;
			}
			else if(level == 'first'){
				data.level = '头等舱';
				data.fare = result.attributes.firstFare;
			}
			data.flight = result.attributes;
			res.render('newOrder', data);
		},error:function(err){
			res.status(404).send(err);
			res.end();
		}
	})
});

app.get('/orderDetail/:orderId',Helper.requiredAuthentication, function(req,res){
	var id = req.params.orderId;
	var data = getRenderData(req);
	data.title = '订单详情';
	var OrderForm = Models.getClass("OrderForm");
	OrderForm.findOne({_id:id})
	.populate("flightId")
	.exec(function(err,order){
		if(order.level == 'business'){
			data.level = '商务舱';
		}
		else if(order.level == 'economy'){
			data.level = '经济舱';
		}
		else if(order.level == 'first'){
			data.level = '头等舱';
		}
		data.order = order;
		res.render('orderDetail',data);
	});
});

app.get('/orderList/',Helper.requiredAuthentication, function(req,res){
	var data = getRenderData(req);
	data.title = '历史订单';

	var OrderForm = Models.getClass("OrderForm");
	OrderForm.find({userId:req.session.user._id})
	.populate("flightId")
	.limit(15)
	.sort('-meta.updateAt')
	.exec(function(err,list){
		data.orderList = list;
		res.render('orderList',data);
	});
});



/******前端请求ajax******/

app.get('/user/delOrder/:id',Helper.requiredAuthentication,function(req,res){
	var id = req.params.id;
	var object = new Database.Object("OrderForm", {_id:id});
	object.delete({
		success:function(_obj){
			// res.redirect("/orderList?success=true");
			res.send("true");
			return;
		},error:function(error){
			// res.redirect("/orderList?success=false");
			res.send("false");
			return ;
		}
	});
});

app.post('/newOrder/:flightId/:flightLevel',Helper.requiredAuthentication,function(req,res){
	var flightId = req.params.flightId;
	var flightLevel = req.params.flightLevel;
	var data = JSON.parse(req.body.data)
	var passengerInfo = data.passengerInfo;
	var contactInfo = data.contactInfo;
	var fare = data.fare;
	var date = new Date();
	var minutes = date.getMinutes();
	if(minutes<10)minutes = '0'+minutes;
	var hours = date.getHours();
	if(hours<10)hours = '0'+hours;
	date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+hours+":"+minutes;
	var object = new Database.Object("OrderForm", {
		orderDate:     date, //订购日期
		flightId:      flightId, //航班id
		userId:        req.session.user._id, //用户id
		level:         flightLevel, //舱位等级 first business economy
		fare:          fare,
		passengerInfo: passengerInfo, //乘客信息
		contactInfo:   contactInfo  //联系信息
	});
	var query = new Database.Query("Flight");
	query.get(flightId,{
		success:function(flight){
			var toBeSave={};
			toBeSave._id = flight.attributes._id;
			if(flightLevel == 'business'){
				if(flight.attributes.businessCount<0){
					res.status(404).send("sorry, there is no tickets left");
					return ;
				} else {
					flight.attributes.businessCount-=1;
				}
				toBeSave.businessCount = flight.attributes.businessCount;
			}
			else if(flightLevel == 'economy'){
				if(flight.attributes.economyCount<0){
					res.status(404).send("sorry, there is no tickets left");
					return ;
				} else {
					flight.attributes.economyCount-=1;
				}
				toBeSave.economyCount = flight.attributes.economyCount;
			}
			else if(flightLevel == 'first'){
				if(flight.attributes.firstCount<0){
					res.status(404).send("sorry, there is no tickets left");
					return ;
				} else {
					flight.attributes.firstCount-=1;
				}
				toBeSave.firstCount = flight.attributes.firstCount;
			}
			flight = new Database.Object(flight.className);
			flight.save(toBeSave,{
				success:function(newone){
					object.save(null,{
						success:function(_obj){
							res.send(_obj);
							res.end();
						},error:function(error){
							res.status(404).send(error);
							res.end();
						}
					});
				},error:function(error){
					res.status(404).send(error);
					res.end();
				}
			});
		},error:function(error){
			res.status(404).send(error);
			res.end();
		}
	})
	
});

app.post('/admin/modify/:id',Helper.adminAuth,function(req,res){
	var id = req.params.id;
	var obj = req.body;
	if(id!="undefined")obj._id = id;
	var className = "Flight";
	var object = new Database.Object(className, obj);
	object.save(null,{
		success:function(_obj){
			res.redirect("/ticketDetail/"+_obj.attributes._id+"?success=true");
			res.end();
			return;
		},error:function(error){
			res.redirect("/ticketDetail/"+_obj.attributes._id+"?success=false");
			res.end();
			return ;
		}
	});
});

//登录
app.post('/login',function(req,res){
	Helper.authenticate(req.body.username,req.body.password,function(err,user){
		 if (user) {
            req.session.regenerate(function () {
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                // res.redirect('/?success='+req.session.success);
                var frontUser = {username:user.username,role:user.role};
                res.send({user:frontUser});
                return ;
            });
        } else {
            req.session.error = 'Authentication failed, please check your ' + ' username and password.';
            res.send({error:req.session.error});
            return;
            // res.redirect('/?error='+req.session.error);
        }
	})

})
//注册
app.post('/signup',function(req,res){
	Helper.userExist(req.body.username,function(err,exist){
		if(err||exist){
			res.send({error:err});
			res.end();
		} else {
			var object = new Database.Object("User", {
				username:req.body.username,
				password:req.body.password,
				role:req.body.role
			});
			object.save(null,{
				success:function(_obj){
					var frontUser = {username:_obj.attributes.username,role:_obj.attributes.role};
               		res.send({user:frontUser});
					res.end();
				},error:function(error){
					res.status(404).send({error:error});
					res.end();
				}
			});
		}
	});
})

//注销
app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.send('success');
        res.end();
    });
});

/*******对前端发送来的数据库请求进行处理******/
/****为保证用户数据安全，以下函数操作设置为不可对用户信息进行****/

//根据条件查找数据
//不可处理用户表
app.get('/findData',function(req,res){
	var q = req.query.data;
	q = JSON.parse(q);
	var className = q.className;
	if(Helper.noUserClassAuth(className,req,res))return ;
	var query = new Database.Query(className,q);
	query.find({
		success:function(obj){
			res.send(obj);
			res.end();
		},error:function(err){
			res.status(404).send(err);
			res.end();
		}
	});
});

//根据id获取记录
//不可处理用户表
app.get('/getData',function(req,res){
	var q = req.query.data;
	q = JSON.parse(q);
	var className = q.className;
	if(Helper.noUserClassAuth(className,req,res))return ;
	var query = new Database.Query(className,q);
	query.get(q._id,{
		success:function(result){
			res.send(result);
			res.end();
		},error:function(err){
			res.status(404).send(err);
			res.end();
		}
	});
});

//返回符合条件的记录数量
app.get('/count',function(req,res){
	var q = req.query.data;
	q = JSON.parse(q);
	var className = q.className;
	if(Helper.noUserClassAuth(className,req,res))return ;
	var query = new Database.Query(className,q);
	query.count({
		success:function(result){
			res.send(result);
			res.end();
		},error:function(err){
			res.status(404).send(err);
			res.end();
		}
	});
});

//保存数据(新建&修改)
//需要管理员权限
app.post('/save',Helper.adminAuth,function(req,res){
	var obj = req.body.data;
	obj = JSON.parse(obj);
	var className = obj.className;
	var object = new Database.Object(className, obj.attributes);
	object.save(null,{
		success:function(_obj){
			res.send(_obj);
			res.end();
		},error:function(error){
			res.status(404).send(error);
			res.end();
		}
	});
});

//删除单个数据
//需要管理员权限
app.post('/removeById',Helper.adminAuth,function(req,res){
	var obj = req.body.data;
	obj = JSON.parse(obj);
	var className = obj.className;
	var object = new Database.Object(className,obj.attributes);
	object.delete({
		success:function(_obj){
			res.send(_obj);
			res.end();
		},error:function(error){
			res.status(404).send(error);
			res.end();
		}
	});
});

/*******对前端发送来的数据库请求进行处理 END******/