$(document).ready(function() {

	$.ajax({
		url : "backtracking.js",
		dataType: "text",
		success : function (data) {
			$("#backtrackingCode").html(data);

			var map_solution = CSP.get_solution ( ["WA", "NT", "SA", "Q", "NSW", "V", "T"],
												  {"WA":["r","g","b"], 
												   "NT":["r","g","b"], 
												   "SA":["r","g","b"], 
												   "Q":["r","g","b"], 
												   "NSW":["r","g","b"], 
												   "V":["r","g","b"], 
												   "T":["r","g","b"]},
												  {"WA":["NT", "SA"], 
												   "NT":["WA", "SA", "Q"], 
												   "SA":["WA", "NT", "Q", "NSW", "V"],
												   "Q": ["NT", "SA", "NSW"],
												   "NSW":["Q", "SA", "V"],
												   "V":["SA", "NSW"],
												   "T":[]},
												  function (A, a, B, b){
													  //the constraint is that the two colours should not equal each other if the two variables are neighbours
													  return a != b;
												  });

			//add this to the current HTML output until the canvas visualisation is implemented
			var str = "";
			if (map_solution){
				for (variable in map_solution){
					if (map_solution.hasOwnProperty(variable)){
						if (str != "")
							str += ", ";
						str += variable+" set to "+map_solution[variable];
					}
				}
			}else
				str = "Failed! No solution!";

			$("#backtracingCode").append("\nThe Map Colouring Problem has the following solution computed: "+str);

		}
	});

}); 
