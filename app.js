var express = require('express');
var port = process.env.PORT || 80;
var app = express();

//能将表单的数据进行格式化
//app.use(express.bodyParser());
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
		title: 'airplaneTickets',
		movies:[{
			title: '机械战警',
			_id: 1,
			director: 'SB',
			country: '美国',
			year: 2014,
			meta:{
				createAt:'05/02/2014'
			}
		}, {
			title: '机械战警',
			_id: 1,
			director: 'SB',
			country: '美国',
			year: 2014,
			meta:{
				createAt:'05/02/2014'
			}
		}, {
			title: '机械战警',
			_id: 1,
			director: 'SB',
			country: '美国',
			year: 2014,
			meta:{
				createAt:'05/02/2014'
			}
		}, {
			title: '机械战警',
			_id: 1,
			director: 'SB',
			country: '美国',
			year: 2014,
			meta:{
				createAt:'05/02/2014'
			}
		}, {
			title: '机械战警',
			_id: 1,
			director: 'SB',
			country: '美国',
			year: 2014,
			meta:{
				createAt:'05/02/2014'
			}
		}, {
			title: '机械战警',
			_id: 1,
			director: 'SB',
			country: '美国',
			year: 2014,
			meta:{
				createAt:'05/02/2014'
			}
		}, {
			title: '机械战警',
			_id: 1,
			director: 'SB',
			country: '美国',
			year: 2014,
			meta:{
				createAt:'05/02/2014'
			}
		}, {
			title: '机械战警',
			_id: 1,
			director: 'SB',
			country: '美国',
			year: 2014,
			meta:{
				createAt:'05/02/2014'
			}
		}]
	})
});
