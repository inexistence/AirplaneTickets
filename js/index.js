
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
	var PER_NUM = 10;

	function countTotalPages(){
		var query = new Database.Query('Flight');
		query.count({
			success:function(count){
				$scope.pages = count.number/PER_NUM;
			},error:function(error){
				console.log(error);
			}
		})
	}

	function queryByPage(page){
		var query = new Database.Query('Flight');
		// query.equalTo('flyTime','约9小时');
		query.skip(page);
		query.limit(PER_NUM);
		query.find({
			success:function(results){
				console.log(results);
				$scope.flights = results;
				// results[0].delete();
			},error:function(error){
				console.log("error");
				console.log(error);
			}
		});
		// query.get("549dbda4200907202159f891",{
		// 	success:function(obj){
		// 		console.log(obj);
		// 		$scope.flights=[obj];
		// 	},error:function(error){
		// 		console.log(error);
		// 	}
		// });
		
	};

	queryByPage(page);
	countTotalPages();
	


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