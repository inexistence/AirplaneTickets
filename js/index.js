
$(document).ready(function(){
	// $.fn.datetimepicker.dates['zh-CN'] = {
	// 		days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
	// 		daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
	// 		daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
	// 		months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
	// 		monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
	// 		today: "今天",
	// 		suffix: [],
	// 		meridiem: ["上午", "下午"]
	// };
	$.ajax({
		type: 'POST',
		url: '/',
		data: { name: "John", age: 18 },
		success: function(data){
			// alert("Data Loaded: " + data);
		},
		dataType: 'text'
	});
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
