
$(document).ready(function(){

	// $("#leaveCity").select2({
	// 	data:[{id:0,text:'广州'},{id:2,text:'北京'},{id:3,text:'上海'},{id:4,text:'马来西亚'},{id:5,text:'天空'},{id:6,text:'地狱'},{id:7,text:'新加坡'}]
	// });
	// $("#arrCity").select2({
	// 	data:[{id:0,text:'广州'},{id:2,text:'北京'},{id:3,text:'上海'},{id:4,text:'马来西亚'},{id:5,text:'天空'},{id:6,text:'地狱'},{id:7,text:'新加坡'}]
	// });
	$("#sortOrder").select2({
		data:[{id:0,text:'出发时间'},{id:1,text:'经济舱票价'},{id:2,text:'商务舱票价'},{id:3,text:'头等舱票价'},{id:4,text:'经济舱票数'},{id:5,text:'商务舱票数'},{id:6,text:'头等舱票数'}]
	});
	
	$('#startDatepicker').datepicker();
	// $('#endDatepicker').datepicker();
});

var oldPage = 1;
var curPage = 1;
function activePage(){
	$("#page"+oldPage).removeClass("active");
	$("#page"+curPage).addClass("active")
}

app.controller("indexCtrl", ['$scope', 'Util','Database',
function($scope, Util, Database) {
	//显示第1页
	$scope.curPage = 1;
	$scope.showMaxPageNum = 10;
	//每页的记录数量
	var PER_NUM = 10;
	//底部页码最多显示3个
	// $scope.SHOW_PAGE_LEN = 3;
	var leaveCity;
	var arrCity;
	var leaveDate;
	var flightNumber;
	var company;
	var sortOrder='-meta.updateAt';

	$scope.pages = [];

	function activePageFun(_page){
		$scope.activePage = [];
		var add = _page - 6;
		add = add>=0?add:0;
		for(var i = 0; i < $scope.pageNum && $scope.showMaxPageNum; i++){
			$scope.activePage.push(false);
			if(i+1+add==_page)
				$scope.activePage[i]=true;
			else {
				$scope.activePage[i]=false;
			}
		}
		console.log($scope.activePage);
	}

	function renderPageGuide(){
		$scope.pages = [];
		var add = $scope.curPage - 6;
		add = add>=0?add:0;
		for(var i = 0; i+add < $scope.pageNum && i < $scope.showMaxPageNum; i++){
			$scope.pages.push(i+1+add);
		}
		//activePageFun($scope.curPage);

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
		if(flightNumber){
			query.equalTo('flightNumber',flightNumber);
		}
		if(company){
			query.equalTo('company',company);
		}
		if(sortOrder){
			query.sort(sortOrder);
		}
		query.count({
			success:function(count){
				$scope.$apply(function(){
					$scope.pageNum = Math.ceil(count.number/PER_NUM);
					renderPageGuide();
				});
				setTimeout("activePage()",200);
			},error:function(error){
				console.log(error);
			}
		})
	}

	$scope.queryByPage = function(_page){
		$scope.curPage = curPage = _page;
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
		if(flightNumber){
			query.equalTo('flightNumber',flightNumber);
		}
		if(company){
			query.equalTo('company',company);
		}
		if(sortOrder){
			query.sort(sortOrder);
		}
		query.skip((_page-1)*PER_NUM);
		query.limit(PER_NUM);
		query.find({
			success:function(results){
				$scope.$apply(function(){
					$scope.flights = results;
					renderPageGuide();

					
				});
				setTimeout("activePage()",200);
				
				setTimeout(function(){
					$scope.oldPage = oldPage = _page;	
				},300);
				
			},error:function(error){
				console.log("error");
				console.log(error);
			}
		});
	};

	$scope.search = function(){
		leaveCity = $("#leaveCity").val();
		arrCity = $("#arrCity").val();
		leaveCity = $.trim(leaveCity);
		arrCity = $.trim(arrCity);

		company = $("#company").val();
		flightNumber = $("#flightNumber").val();
		company = $.trim(company);
		flightNumber = $.trim(flightNumber);

		if($("#sortOrder").select2("data")!=null){
			var id = $("#sortOrder").select2("data").id;
			switch(id){
				case 0:
				sortOrder = {'leaveDate':1,'leaveTime':1};
				break;
				case 1:
				sortOrder="economyFare";
				break;
				case 2:
				sortOrder="businessFare";
				break;
				case 3:
				sortOrder="firstFare";
				case 4:
				sortOrder="economyCount";
				break;
				case 5:
				sortOrder="businessCount";
				break;
				case 6:
				sortOrder="firstCount";
				break;
			}
			var orderLevel = $(".orderLevel");
			for(var i = 0; i < orderLevel.length; i++){
				if(orderLevel[i].checked){
					levelIndex = i;
				}
			}
			if(levelIndex==1)sortOrder='-'+sortOrder;
		}
		
		var startDate = $("#startDatepicker").datepicker('getDate');
		if(startDate&&leaveDate!="Invalid Date"){
			var month = startDate.getMonth()+1;
			var day = startDate.getDate();
			if(Number(day)<10)day = '0' + day;
			if(Number(month)<10)month='0' + month;
			leaveDate = startDate.getFullYear()+"-"+month+"-"+day;
		}
		if(leaveDate=='NaN-NaN-NaN')leaveDate=null;
		// alert("出发地:"+leaveCity+"  目的地:"+arrCity+"  出发时间:"+leaveDate);
		$scope.curPage = 1;
		countTotalPages();
		$scope.queryByPage($scope.curPage);
	}
	
	
	countTotalPages();
	$scope.queryByPage($scope.curPage);

	$scope.jump2target = function(){
		var targetPage = $("#target-page").val();
		if(targetPage>$scope.pageNum||targetPage<=0){
			alert("当前查询页数超出范围!");
			return ;
		}
		$scope.queryByPage(targetPage);
	}


	//------机票管理------
	$scope.delete = function(index){
		var flight = $scope.flights[index];
		flight.delete({
			success:function(obj){
				$scope.$apply(function(){
					$scope.flights.splice(index,1);	
				});
				countTotalPages();
				alert("删除成功");
			},error:function(err){
				console.log(err)
				alert(err.responseText);
			}
		});
	};

}]);