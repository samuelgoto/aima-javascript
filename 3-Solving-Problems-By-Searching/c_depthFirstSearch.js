$(document).ready(function(){
	$.ajax({
		url : "depthFirstSearch.js",
		dataType: "text",
		success : function (data) {
			$("#depthFirstSearchCode").html(data);
		}
	});
});