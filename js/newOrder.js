$(document).ready(function(){

	$("#id-type").select2({
		data:[{id:0,text:'身份证'},{id:2,text:'护照'},{id:3,text:'港澳通行证'},{id:4,text:'台胞证'},{id:5,text:'海员证'},{id:6,text:'大陆居民往来台湾通行证'}]
	});
});

app.controller("newOrderCtrl", ['$scope', 'Util','Database',
function($scope, Util, Database) {
	$scope.passengerInfo = {};
	$scope.passengerInfo.identity = {};
	$scope.contactInfo = {};
	$scope.passengerInfo.country = "中国";
	$scope.passengerInfo.identity.place =  "中国";
	$scope.submitOrder = function(){
		//获取证件类型
		if($scope.passengerInfo.identity){
			var idType = $("#id-type").select2("data");
			if(idType)
				$scope.passengerInfo.identity.type = idType.text;
			if($scope.passengerInfo.identity.type==null){
				alert("请选择证件类型!");
				return ;
			}
			if(!$scope.passengerInfo.identity.number){
				alert("请填写证件号!");
				return ;
			}
		} else {
			alert("请填写证件号!");
			return ;
		}
		if(!$scope.passengerInfo.name){
			alert("请填写乘客姓名!");
			return ;
		}
		if(!$scope.contactInfo.phoneNumber){
			alert("请填写联系电话!");
			return ;	
		}
		$scope.passengerInfo.name = $.trim($scope.passengerInfo.name);
		$scope.contactInfo.phoneNumber = $.trim($scope.contactInfo.phoneNumber);
		$scope.passengerInfo.name = $.trim($scope.passengerInfo.name);
		$scope.passengerInfo.identity.number = $.trim($scope.passengerInfo.identity.number);
		//获取性别
		var sex = $(".sex");
		for(var i = 0; i < sex.length; i++){
			if(sex[i].checked){
				$scope.passengerInfo.sex = sex[i].value;
			}
		}
		//获取年龄类型
		var ageLevel = $(".ageLevel");
		for(var i = 0; i < ageLevel.length; i++){
			if(ageLevel[i].checked){
				$scope.passengerInfo.ageLevel = ageLevel[i].value;
			}
		}
		var flightId = Util.getQueryString("flightId");
		var flightLevel = Util.getQueryString("flightLevel");
		var fare = $("#fare").text();

		var data = 'data='+JSON.stringify({
				passengerInfo: $scope.passengerInfo,
				contactInfo: $scope.contactInfo,
				fare: fare
			});
		$.ajax({
			type:"POST",
			url: "/newOrder/"+flightId+"/"+flightLevel,
			data: data,
			success:function(data, status, headers, config) { 
				alert("提交成功！");
				window.location.href = '/';
			},
			error:function(data, status, headers, config){
				alert("提交订单失败！");
			}
		});
	}

	// var query = new Database.Query("OrderForm");
	// query.find({
	// 	success:function(res){
	// 		console.log(res);
	// 		for(var i = 0; i < res.length; i++){
	// 			res[i].delete();
	// 		}
	// 	}
	// })

}]);