
var cheerio = require("cheerio");
var mongoose = require('mongoose');
var fs=require('fs');
                       
var Database = require('./database/databaseModule');
var Models = require('./database/models/models');

//连接本地数据库airplaneTickets
mongoose.connect('mongodb://localhost/airplaneTickets');

function download(url, callback) {
	http.get(url, function(res) {
		var data = "";
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on("end", function() {
			callback(data);
		});
	}).on("error", function() {
		callback(null);
	});
};
function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g, "");
}
var saveProject = function($){
	var number = 0;
	console.log('saving');
	var offcity = $(".fsearch_title").find("span").first();
	var arrcity = offcity.next().next();
	offcity = offcity.text();
	arrcity = arrcity.text();
	console.log(offcity+"-"+arrcity);
	$("tbody").find(".theFlight").each(function(index, tr){
		var flyoffdate = $(this).attr("flyoffdate");
		var flightno = $(this).attr("flightno");
		var offport = $(this).attr("offport");
		var arrport = $(this).attr("arrport");
		var offtime = $(this).attr("offtime");
		var arrtime = $(this).attr("arrtime");
		var price = $(this).attr("price");
		price = Number(price);
		var dspace = $(this).attr("dspace");
		var comp = $(this).attr("comp");

		if(flyoffdate==undefined)flyoffdate="2015-01-16";

		var flight ={};
		flight.company = comp;
		flight.flightNumber = flightno;
		flight.leaveTime = offtime;
		flight.leaveDate = flyoffdate;
		flight.arrTime = arrtime;
		flight.arrDate = flyoffdate;
		flight.leaveAirport = offport;
		flight.leaveCity = offcity;
		flight.arrAirport = arrport;
		flight.arrCity = arrcity;
		flight.economyCount = 100;
		flight.economyFare = price;
		flight.businessFare = Math.ceil(price*1.5);
		flight.businessCount = 100;
		flight.firstCount = 100;
		flight.firstFare = price*2;

		// console.log(flight);

		var obj = new Database.Object("Flight",flight);
		obj.save(null,{
			success:function(){
				number+=1;
				console.log("---- end "+number+" ----");		
			}
		});
		
	});
}

//c1.txt c2.txt c3.txt c4.txt
var filename = 'c4.txt';
//读取文件
 fs.readFile('./crawlPage/'+filename,'utf8',function(err,data){
 	console.log("read "+filename);
    if(err){
        return console.log(err);
    }
    var $ = cheerio.load(data);
	// console.log(data);
	saveProject($);
 })