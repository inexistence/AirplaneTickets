
$(document).ready(function(){

	$("#startPlace").select2({
		data:[{id:0,text:'广州'},{id:2,text:'深圳'},{id:3,text:'上海'},{id:4,text:'南京'}]
	});
	$("#endPlace").select2({
		data:[{id:0,text:'广州'},{id:2,text:'深圳'},{id:3,text:'上海'},{id:4,text:'南京'}]
	});
	
	 $('#startDatepicker').datepicker();
	 $('#endDatepicker').datepicker();
});

app.controller("indexCtrl", ['$scope', 'Util','Database',
function($scope, Util, Database) {
	//显示第1页
	$scope.curPage = 1;
	//每页的记录数量
	var PER_NUM = 2;
	//底部页码最多显示3个
	// $scope.SHOW_PAGE_LEN = 3;

	var activePageFun=function(_page){
		$scope.activePage = [];
		$scope.activePage[_page]=true;
	}

	function countTotalPages(){
		var query = new Database.Query('Flight');
		query.count({
			success:function(count){
				$scope.pageNum = Math.round(count.number/PER_NUM);
				console.log($scope.pageNum);
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
		$scope.curPage = _page;
		var query = new Database.Query('Flight');
		// query.equalTo('flyTime','约9小时');
		query.skip(($scope.curPage-1)*PER_NUM);
		query.limit(PER_NUM);
		query.find({
			success:function(results){
				$scope.flights = results;
				activePageFun($scope.curPage-1);
				// results[0].delete();
			},error:function(error){
				console.log("error");
				console.log(error);
			}
		});
	};

	$scope.search = function(){
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

		var startDate = $("#startDatepicker").datepicker('getDate');
		startDate = startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate()
		console.log(startDate);
		alert("出发地:"+startValue+"  目的地:"+endValue+"  出发时间:"+startDate);
	}
	
	activePageFun($scope.curPage);
	$scope.queryByPage($scope.curPage);
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