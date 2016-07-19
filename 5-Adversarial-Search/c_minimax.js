$(document).ready(function(){
  $.ajax({
    url : "minimax.js",
    dataType: "text",
    success : function (data) {
      $("#minimaxCode").html(data);
    }
  });
});