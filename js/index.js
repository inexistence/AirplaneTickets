
$(document).ready(function(){

	$("#startPlace").select2({
		data:[{id:0,text:'广州白云国际机场'},{id:2,text:'北京国际机场'},{id:3,text:'上海白云国际机场'},{id:4,text:'马来西亚大海国际机场'},{id:5,text:'天空国际机场'},{id:6,text:'地狱机场'}]
	});
	$("#endPlace").select2({
		data:[{id:0,text:'广州白云国际机场'},{id:2,text:'北京国际机场'},{id:3,text:'上海白云国际机场'},{id:4,text:'马来西亚大海国际机场'},{id:5,text:'天空国际机场'},{id:6,text:'地狱机场'}]
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
	var startPlace;
	var arrPlace;

	var activePageFun=function(_page){
		$scope.activePage = [];
		$scope.activePage[_page]=true;
	}

	function countTotalPages(){
		var query = new Database.Query('Flight');
		if(startPlace){
			query.equalTo('flyAirport',startPlace);	
		}
		if(arrPlace){
			query.equalTo('arrAirport',arrPlace);
		}
		query.count({
			success:function(count){
				$scope.pageNum = Math.round(count.number/PER_NUM);
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
		if(startPlace){
			query.equalTo('flyAirport',startPlace);	
		}
		if(arrPlace){
			query.equalTo('arrAirport',arrPlace);
		}
		// query.equalTo('flyTime','约9小时');
		query.skip(($scope.curPage-1)*PER_NUM);
		query.limit(PER_NUM);
		query.find({
			success:function(results){
				$scope.flights = results;
				activePageFun($scope.curPage-1);
				console.log(results);
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
		startPlace = $("#startPlace").select2("data").text;

		//id
		var endId = $("#endPlace").val();
		//value
		arrPlace = $("#endPlace").select2("data").text;

		var startDate = $("#startDatepicker").datepicker('getDate');
		startDate = startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate()
		// console.log(startDate);
		// alert("出发地:"+startValue+"  目的地:"+endValue+"  出发时间:"+startDate);
		$scope.curPage = 1;
		countTotalPages();
		$scope.queryByPage($scope.curPage);
	}
	
	activePageFun($scope.curPage-1);
	countTotalPages();
	$scope.queryByPage($scope.curPage);
	
	// var flight = new Database.Object('Flight',{
	// 	company:'马来西亚航空',
	// 	planeName:'RP33 22(小)',
	// 	flyDate:'2月1日 12:25',
	// 	arrDate:'2月5日 23:15',
	// 	flyTime:'约12小时',
	// 	flyAirport:'上海白云国际机场',
	// 	arrAirport:'马来西亚大海国际机场',
	// 	fare:'¥222',
	// 	tax:'¥111'
	// });

	// flight.save(null,{
	// 	success:function(obj){
	// 		console.log(obj);
	// 	}
	// });

}]);