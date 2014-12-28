var express = require('express');
var _ = require('underscore');
//使用mongoose作为数据库
var mongoose = require('mongoose');
var port = process.env.PORT || 80;
//处理post中的data数据
var bodyParser = require('body-parser');
var app = express();
//连接本地数据库airpaneTickets
mongoose.connect('mongodb://localhost/airpaneTickets');

var Models = require('./database/models/models');


//使前端post来的数据能从req.body中取得
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname));
//设置视图根目录
app.set('views', './views/pages');
//设置默认模版引擎
app.set('view engine', 'jade');
// app.set('view options', { pretty: true });

//监听端口
app.listen(port);

console.log('airplaneTickets started on port '+port);


// 编写路由
// get(路由匹配规则,回调方法)
// 从后端匹配到路由匹配规则,调用回调方法

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

app.get('/findData',function(req,res){
	var query = req.query.data;
	query = JSON.parse(query);
	var className = query.className;
	var Class = Models.getClass(className);
	if(Class===undefined){
		res.status(404).send({error:'can not find class '+className});
		res.end();
		return ;
	}

	Class.fetch(query,function(err,results){
		if(err){
			res.status(404).send({error:err,object:results});
			res.end();
			return ;
		}
		_.each(results,function(obj,index){
			var _obj = {};
			_obj.attributes = obj;
			_obj.className = query.className;
			results[index] = _obj;
		});
		res.send(results);
		res.end();
	})
	
});

app.get('/getData',function(req,res){
	var query = req.query.data;
	query = JSON.parse(query);
	var className = query.className;
	var Class = Models.getClass(className);
	if(Class===undefined){
		res.status(404).send({error:'can not find Class '+className});
		res.end();
		return ;
	}
	if(query._id===undefined){
		res.status(404).send({error:'can not find Object without id.'});
		res.end();
		return ;
	}
	Class.findById(query._id, function(err,result){
		if(err){
			res.status(404).send({error:err,object:result});
			res.end();
			return ;
		}
		
		res.send({className:className,attributes:result});
		res.end();
	});
});

app.get('/count',function(req,res){
	var query = req.query.data;
	query = JSON.parse(query);
	var className = query.className;
	var Class = Models.getClass(className);
	if(Class===undefined){
		res.status(404).send({error:'can not find Class '+className});
		res.end();
		return ;
	}

	Class.count(query.equal, function(err,result){
		if(err){
			res.status(404).send({error:err,object:result});
			res.end();
			return ;
		}
		res.send({className:className,number:result});
		res.end();
	});
});



app.post('/save',function(req,res){
	var obj = req.body.data;
	obj = JSON.parse(obj);
	var className = obj.className;
	var Class = Models.getClass(className);
	if(Class===undefined){
		res.status(404).send({error:'can not find Class '+className});
		res.end();
		return ;
	}
	var _obj;
	if(obj.attributes._id !== undefined) {
		Class.findById(obj.attributes._id, function(err,result){
			if(err){
				res.status(404).send({error:err,object:obj});
				res.end();
				return ;
			}
			_obj = _.extend(result, obj.attributes);
			_obj.save(function(err,obj){
				if(err){
					res.status(404).send({error:err,object:obj});
					res.end();
					return ;
				}
				res.send({className:className,attributes:obj});
				res.end();
				});
		});
	} else {
		_obj = new Class(obj.attributes);
		_obj.save(function(err,obj){
			if(err){
				res.status(404).send({error:err,object:obj});
				res.end();
				return ;
			}
			res.send({className:className,attributes:obj});
			res.end();
		});
	}
});


app.post('/removeById',function(req,res){
	var obj = req.body.data;
	obj = JSON.parse(obj);
	var className = obj.className;
	var Class = Models.getClass(className);
	if(Class===undefined){
		res.status(404).send({error:'can not find Class '+className});
		res.end();
		return ;
	}
	if(obj.attributes._id !== undefined) {
		Class.remove({_id:obj.attributes._id},function(err,obj){
			if(err){
				res.status(404).send({error:err,object:obj});
				res.end();
				return ;
			}
			res.send({className:className,attributes:obj});
			res.end();
		});
	} else {
		res.status(404).send({error:'can not find Object without id.'});
		res.end();
		return ;
	}
});