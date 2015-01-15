
app.controller("headerCtrl", ['$scope', 'Util','Database',
function($scope, Util, Database) {
	$scope.user = $("#jadeuser").html();
	if($scope.user!=null&&$scope.user.length!=0){
		$scope.user = JSON.parse($scope.user);
	}
	$scope.login = function(){
		var username = $("#lusername").val();
		var password = $("#lpassword").val();
		$.ajax({
			type:'POST',
			url:'/login',
			data:{username:username,password:password},
			success:function(data, status, headers, config) {
				if(data.user){
					alert("登录成功！");
					$scope.$apply(function(){
						$scope.user = data.user;	
					})
					$("#login").modal('hide');
				}
				else if(data.error)
					alert("登录失败！"+data.error);
			},
			error:function(data, status, headers, config){
				alert("登录失败！");
			}
		});
	}
	$scope.signup = function(){
		var role = $("#srole").val();
		var username = $("#susername").val();
		var password = $("#spassword").val();
		$.ajax({
			type:'POST',
			url:'/signup',
			data:{username:username,password:password,role:role},
			success:function(data, status, headers, config) {
				console.log(data.error);
				if(data.user){
					alert("注册成功！");
					// $scope.$apply(function(){
					// 	$scope.user = data.user;	
					// })
					$("#signup").modal('hide');
				}
				else if(data.error)
					alert("注册失败！"+data.error);
			},
			error:function(data, status, headers, config){
				alert("注册失败！");
			}
		});
	}

	$scope.logout = function(){
		$.ajax({
			type:'GET',
			url:'/logout',
			success:function(data, status, headers, config) {
				$scope.$apply(function(){
					$scope.user = null;	
				})
			},
			error:function(data, status, headers, config){
			}
		});
	}
}]);