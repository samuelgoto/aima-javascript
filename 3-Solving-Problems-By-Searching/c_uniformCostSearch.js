$(document).ready(function(){
	$.ajax({
		url : "uniformCostSearch.js",
		dataType: "text",
		success : function (data) {
			$("#uniformCostSearchCode").html(data);
		}
	});
});