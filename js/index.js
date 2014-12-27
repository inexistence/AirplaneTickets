
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
	//显示第1页
	var page = 1;
	//每页的记录数量
	var PER_NUM = 1;
	//底部页码最多显示3个
	$scope.SHOW_PAGE_LEN = 3;

	var activePageFun=function(_page){
		$scope.activePage = [];
		$scope.activePage[_page]=true;
	}

	activePageFun(page);

	function countTotalPages(){
		var query = new Database.Query('Flight');
		query.count({
			success:function(count){
				$scope.pageNum = count.number/PER_NUM;
				$scope.pages = [];
				for(var i = 0; i < $scope.pageNum; i++){
					$scope.pages.push(i+1);
				}
			},error:function(error){
				console.log(error);
			}
		})
	}

	$scope.queryByPage = function(_page){
		page = _page;
		var query = new Database.Query('Flight');
		// query.equalTo('flyTime','约9小时');
		query.skip(page-1);
		query.limit(PER_NUM);
		query.find({
			success:function(results){
				$scope.flights = results;
				activePageFun(page-1);
				// results[0].delete();
			},error:function(error){
				console.log("error");
				console.log(error);
			}
		});
	};

	$scope.queryByPage(page);
	countTotalPages();
	


	// var flight = new Database.Object('Flight',{
	// 	company:'天堂航空',
	// 	planeName:'RP233 22(小)',
	// 	flyDate:'5月8日 12:25',
	// 	arrDate:'5月15日 23:15',
	// 	flyTime:'约1小时',
	// 	flyAirport:'上海白云国际机场',
	// 	arrAirport:'天空国际机场',
	// 	fare:'¥22',
	// 	tax:'¥3'
	// });

	// flight.save(null,{
	// 	success:function(obj){
	// 		console.log(obj);
	// 	}
	// });
}]);