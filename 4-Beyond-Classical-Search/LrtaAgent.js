/*
Logic for LRTA Agent
Author: Souradeep Nanda
*/
var LrtaAgent = function(problem){
	this.problem = problem;
	this.result = new Array(this.problem.TOTAL_STATES);
	for(var i = 0; i < this.problem.TOTAL_STATES; i++)
		this.result[i] = [];
	this.H = new Array(this.problem.TOTAL_STATES);
	this.a = -1;
	this.s = -1;
	
	this.iterate = function(newState){
		// If reached target then stop
		if(this.problem.goal_test(newState))
			return this.problem.NO_ACTION;
		// If this state is unvisited then calculate H
		if(this.H[newState] == null)
			this.H[newState] = this.problem.h(newState);
		// If not first iteration
		if(this.s != -1){
			this.result[this.s][this.a] = newState;
			var min = Number.MAX_VALUE;
			var actions = this.problem.actions(this.s);
			for(var i = 0; i < actions.length; i++){
				var a = actions[i];
				if(this.result[this.s][a] == null)
					this.result[this.s][a] = this.problem.getNextState(this.s,a);
				var cost = this.lrtaCost(this.s,a,this.result[this.s][a]);				
				if(cost < min) min = cost;
				
				console.log(this.problem.getIJ(this.result[this.s][a])+" "+cost);
			}
			this.H[this.s] = min;
		}
		console.log("\n");
		var min = Number.MAX_VALUE;
		var a = this.problem.NO_ACTION;
		var actions = this.problem.actions(newState);
		for(var i = 0; i < actions.length; i++){
			var b = actions[i];
			if(this.result[newState][b] == null)
				this.result[newState][b] = this.problem.getNextState(newState,b);
			var cost = this.lrtaCost(newState,b,this.result[newState][b]);			
			if(cost < min){
				min = cost;
				a = b;
			}
			console.log(this.problem.getIJ(this.result[newState][b])+" "+cost);
		}
		
		var coord = this.problem.getIJ(newState);
		console.log("(%d,%d)",coord[0],coord[1]);
		
		this.s = newState;
		this.a = a;
		return a;
	}
	this.lrtaCost = function(state,action,newState){
		if(this.H[newState] == null)
			return this.problem.h(state);
		else
			return this.problem.cost(state,action,newState) + this.H[newState];
	}
}

// TODO: Refactor code to extend from a single ProblemStatement class
var LrtaAgentProblemStatement = function(){		
	///////////////////////////////////////////////////
	////// TODO: PUT IN SUPER CLASS (START)
	///////////////////////////////////////////////////
	this.NO_ACTION = 0;
	this.UP = 1;
	this.DOWN = 2;
	this.LEFT = 3;
	this.RIGHT = 4;
	
	this.at = function(i,j){
		return i * this.COLS + j;
	}
	this.getIJ = function(x){
		return [parseInt(x/this.COLS),x%this.COLS];
	}
	this.goal_test = function(state){
		return this.END == state;
	}
	// Get all possible actions
	this.actions = function(state){
		var a = [this.NO_ACTION];
		var i = this.getIJ(state)[0],j = this.getIJ(state)[1];
		if(i - 1 >= 0 && !this.graph[i-1][j]) a.push(this.UP);
		if(i + 1 < this.ROWS && !this.graph[i+1][j]) a.push(this.DOWN);
		if(j - 1 >= 0 && !this.graph[i][j-1]) a.push(this.LEFT);
		if(j + 1 < this.COLS && !this.graph[i][j+1]) a.push(this.RIGHT);
		return a;
	}	
	// Get state resulting from action taken
	this.getNextState = function(state,action){
		var x = this.getIJ(state)[0];
		var y = this.getIJ(state)[1];
		switch(action){
		case this.NO_ACTION = 0: /*Nothing*/ break;
		case this.UP = 1: x--; break;
		case this.DOWN = 2: x++; break;
		case this.LEFT = 3: y--; break;
		case this.RIGHT = 4: y++; break;
		}
		return this.at(x,y);
	}
	
	///////////////////////////////////////////////////
	////// TODO: PUT IN SUPER CLASS (END)
	///////////////////////////////////////////////////
	
	this.init = function(){
		this.graph = 
		[[0,0,0,1],
		[1,1,0,1],
		[0,0,0,1],
		[0,1,0,1]];
		
		this.ROWS = this.graph.length;
		this.COLS = this.graph[0].length;
		this.TOTAL_STATES = this.ROWS * this.COLS;
		this.INITIAL = 0;
		this.END = 12;
	}
	
	this.init();
	
	// Manhattan distance
	this.h = function(state){
		var current = this.getIJ(state);
		var goal = this.getIJ(this.END);
		var x = Math.abs(current[0]-goal[0]);
		var y = Math.abs(current[1]-goal[1]);
		console.log("Manhattan (%d+%d)",x,y);
		return x+y;
	}	
	
	// Binary manhattan weights
	this.cost = function(state,action,newState){
		if(action == 0) return 0;
		else return 1;
	}
}

var problem = new LrtaAgentProblemStatement();
var state = problem.INITIAL;
var agent = new LrtaAgent(problem);

// Decide next action and take the action
function step(){
	var action = agent.iterate(state);
	state = problem.getNextState(state,action);
}