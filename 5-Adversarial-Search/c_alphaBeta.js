$(document).ready(function(){
  $.ajax({
    url : "alphaBeta.js",
    dataType: "text",
    success : function (data) {
      $("#alphaBetaCode").html(data);
    }
  });
});