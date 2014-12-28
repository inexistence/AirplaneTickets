//------引用的module------
var express = require('express');
var _ = require('underscore');
//使用mongoose作为数据库
var mongoose = require('mongoose');
//处理post中的data数据
var bodyParser = require('body-parser');
//-------------------------


//引用自己写的服务端的数据库Module
//包含Database.Query&Database.Object
var Database = require('./database/databaseModule');

//连接本地数据库airplaneTickets
mongoose.connect('mongodb://localhost/airplaneTickets');


var app = express();

//使前端post来的数据能从req.body中取得
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname));
//设置视图根目录
app.set('views', './views/pages');
//设置默认模版引擎
app.set('view engine', 'jade');


var port = process.env.PORT || 80;
//监听端口
app.listen(port);

console.log('airplaneTickets started on port '+port);


// 编写路由

// index page
app.get('/',function(req, res) {
	res.render('index', {
		title: '机票查询'
	});
});

app.get('/ticketDetail/:id',function(req, res) {
	var id = req.params.id;
	res.render('ticketDetail', {
		title: '机票详情'
	})
});


/*******对前端发送来的数据库请求进行处理******/

//根据条件查找数据
app.get('/findData',function(req,res){
	var q = req.query.data;
	q = JSON.parse(q);
	var className = q.className;
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
app.get('/getData',function(req,res){
	var q = req.query.data;
	q = JSON.parse(q);
	var className = q.className;
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
app.post('/save',function(req,res){
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
app.post('/removeById',function(req,res){
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