
$(document).ready(function(){

	$("#startPlace").select2({
		data:[{id:0,text:'广州'},{id:2,text:'深圳'},{id:3,text:'上海'},{id:4,text:'南京'}]
	});
	$("#endPlace").select2({
		data:[{id:0,text:'广州'},{id:2,text:'深圳'},{id:3,text:'上海'},{id:4,text:'南京'}]
	});
	$("#search").click(function(){  
		if($("#startPlace").select2("data")==null){
			alert("请选择出发地");
			return ;
		}
		if($("#endPlace").select2("data")==null){
			alert("请选择目的地");
			return ;
		}
		//id
		var startId = $("#startPlace").val();
		//value
		var startValue = $("#startPlace").select2("data").text;

		//id
		var endId = $("#endPlace").val();
		//value
		var endValue = $("#endPlace").select2("data").text;
		alert("出发地:"+startValue+"  目的地:"+endValue);
	});
	
	 $('#startDatepicker').datepicker();
	 $('#endDatepicker').datepicker();
});

app.controller("indexCtrl", ['$scope', 'Util','Database',
function($scope, Util, Database) {
	var page = 0;
	var perPageNum = 10;
	var query = new Database.Query('Flights');
	query.equalTo('company','菲律宾航空');
	query.skip(0);
	query.limit(perPageNum);
	query.find({
		success:function(results){
			console.log(results);
			$scope.flights = results;
		},error:function(error){
			console.log("error");
			console.log(error);
		}
	});


	// var flight = new Database.Object('Flight',{
	// 	company:'菲律宾航空',
	// 	planeName:'PR383 320(中)',
	// 	flyDate:'5月6日 01:45',
	// 	arrDate:'5月10日 01:45',
	// 	flyTime:'约10小时',
	// 	flyAirport:'广州白云国际机场',
	// 	arrAirport:'北京国际机场',
	// 	fare:'¥702',
	// 	tax:'¥600',
	// 	page:query.skipNum
	// });

	// flight.save(null,{
	// 	success:function(obj){
	// 		console.log(obj);
	// 	}
	// });
}]);