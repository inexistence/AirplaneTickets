var express = require('express');
var port = process.env.PORT || 80;
//处理post中的data数据
var bodyParser = require('body-parser');
var app = express();

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
	var flights = [{
		_id:'0',
		company:'菲律宾航空',
		planeName:'PR383 320(中)',
		flyDate:'5月6日 01:45',
		arrDate:'5月10日 01:45',
		flyTime:'约10小时',
		flyAirport:'广州白云国际机场',
		arrAirport:'北京国际机场',
		fare:'¥702',
		tax:'¥600',
		page:query.skipNum
	}];
	res.send(flights);
	res.end();
});

app.get('/getData',function(req,res){
	var query = req.query.data;
	query = JSON.parse(query);
	var flights = [{
		_id:'0',
		company:'菲律宾航空',
		planeName:'PR383 320(中)',
		flyDate:'5月6日 01:45',
		arrDate:'5月10日 01:45',
		flyTime:'约10小时',
		flyAirport:'广州白云国际机场',
		arrAirport:'北京国际机场',
		fare:'¥702',
		tax:'¥600',
		page:query.skipNum
	}];
	res.send(flights);
	res.end();
});
