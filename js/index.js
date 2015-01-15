
$(document).ready(function(){

	$("#leaveCity").select2({
		data:[{id:0,text:'广州'},{id:2,text:'北京'},{id:3,text:'上海'},{id:4,text:'马来西亚'},{id:5,text:'天空'},{id:6,text:'地狱'},{id:7,text:'新加坡'}]
	});
	$("#arrCity").select2({
		data:[{id:0,text:'广州'},{id:2,text:'北京'},{id:3,text:'上海'},{id:4,text:'马来西亚'},{id:5,text:'天空'},{id:6,text:'地狱'},{id:7,text:'新加坡'}]
	});
	
	 $('#startDatepicker').datepicker();
	 $('#endDatepicker').datepicker();
});

app.controller("indexCtrl", ['$scope', 'Util','Database',
function($scope, Util, Database) {
	//显示第1页
	$scope.curPage = 1;
	//每页的记录数量
	var PER_NUM = 10;
	//底部页码最多显示3个
	// $scope.SHOW_PAGE_LEN = 3;
	var leaveCity;
	var arrCity;
	var leaveDate;

	var activePageFun=function(_page){
		$scope.activePage = [];
		$scope.activePage[_page]=true;
	}

	function countTotalPages(){
		var query = new Database.Query('Flight');
		if(leaveCity){
			query.equalTo('leaveCity',leaveCity);	
		}
		if(arrCity){
			query.equalTo('arrCity',arrCity);
		}
		if(leaveDate){
			query.equalTo('leaveDate',leaveDate);
		}
		query.count({
			success:function(count){
				$scope.$apply(function(){
					$scope.pageNum = Math.ceil(count.number/PER_NUM);
					$scope.pages = [];
					for(var i = 0; i < $scope.pageNum; i++){
						$scope.pages.push(i+1);
					}
				});
			},error:function(error){
				console.log(error);
			}
		})
	}

	$scope.queryByPage = function(_page){
		$scope.curPage = _page;
		var query = new Database.Query('Flight');
		if(leaveCity){
			query.equalTo('leaveCity',leaveCity);	
		}
		if(arrCity){
			query.equalTo('arrCity',arrCity);
		}
		if(leaveDate){
			query.equalTo('leaveDate',leaveDate);
		}
		query.skip(($scope.curPage-1)*PER_NUM);
		query.limit(PER_NUM);
		query.find({
			success:function(results){
				$scope.$apply(function(){
					$scope.flights = results;
					activePageFun($scope.curPage-1);
					// results[0].delete();
				});
			},error:function(error){
				console.log("error");
				console.log(error);
			}
		});
	};

	$scope.search = function(){
		if($("#leaveCity").select2("data")==null){
			alert("请选择出发地");
			return ;
		}
		if($("#arrCity").select2("data")==null){
			alert("请选择目的地");
			return ;
		}
		//id
		var startId = $("#leaveCity").val();
		//value
		leaveCity = $("#leaveCity").select2("data").text;

		//id
		var endId = $("#arrCity").val();
		//value
		arrCity = $("#arrCity").select2("data").text;

		var startDate = $("#startDatepicker").datepicker('getDate');
		if(startDate&&leaveDate!="Invalid Date")
			leaveDate = startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate();
		if(leaveDate=='NaN-NaN-NaN')leaveDate=null;
		// alert("出发地:"+leaveCity+"  目的地:"+arrCity+"  出发时间:"+leaveDate);
		$scope.curPage = 1;
		countTotalPages();
		$scope.queryByPage($scope.curPage);
	}
	
	activePageFun($scope.curPage-1);
	countTotalPages();
	$scope.queryByPage($scope.curPage);

	// var flight = new Database.Object('Flight',{
	// 	flightNumber: "SQ853 330(宽)",//航班号
	// 	company: "新加坡航空",//公司
	// 	leaveTime:"1:00",//出发时间
	// 	leaveDate:"2015-4-12",//出发日期
	// 	arrTime:"3:00",//到达时间
	// 	arrDate:"2015-4-13",//到达日期
	// 	leaveAirport:"新加坡机场",//出发机场
	// 	leaveCity:"新加坡",//出发城市
	// 	arrAirport:"北京国际机场",//到达机场
	// 	arrCity:"北京",//到达城市
	// 	businessFare:"¥150",//商务舱价格
	// 	businessCount:"100",//商务舱票数
	// 	firstFare:"¥150",//头等舱价格
	// 	firstCount:"100",//头等舱数量
	// 	economyFare:"¥150",//经济舱价格
	// 	economyCount:"100",//经济舱数量	
	// })
	// flight.save();
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

	// flight.save({company:'地狱航空',flyAirport:'地狱机场'},{
	// 	success:function(obj){
	// 		console.log(obj);
	// 	}
	// });

}]);