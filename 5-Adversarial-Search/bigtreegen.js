class Board {
	/*
		b: int array[9], -1 being x, 0 being unmarked, 1 being o
		t: int, -1 being x, 0 being unmarked, 1 being o
	*/
	constructor(b, t) {
		this.turn = t;
		this.tiles = new Array(9);
		for (let i = 0; i < 9; i++)
			this.tiles[i] = b[i];
	}
	
	/*
		reset the board to it's original state
	*/
	reset() {
		this.turn = -1;
		for (let i = 0; i < 9; i++)
			this.tiles[i] = 0
	}
	/*
		mark a tile on the board and change turns
	*/
	pickTile(tile) {
		let result = new Board(this.tiles, this.turn)
		if (result.tiles[tile] == 0) {
			result.tiles[tile] = this.turn
		}
		else if (result.turn != result.tiles[tile]) {
			result.tiles[tile] = 0
		}
		result.turn = -1 * this.turn
		return result
	}
	/*
		0 = in progress
		1 = O won
		2 = X won
		3 = draw
	*/
	get gameState() {
		//check if O has won
		let p = 1;
		if ((this.tiles[0] == p && this.tiles[1] == p && this.tiles[2] == p) ||
			(this.tiles[3] == p && this.tiles[4] == p && this.tiles[5] == p) ||
			(this.tiles[6] == p && this.tiles[7] == p && this.tiles[8] == p) ||
			(this.tiles[0] == p && this.tiles[3] == p && this.tiles[6] == p) ||
			(this.tiles[1] == p && this.tiles[4] == p && this.tiles[7] == p) ||
			(this.tiles[2] == p && this.tiles[5] == p && this.tiles[8] == p) ||
			(this.tiles[2] == p && this.tiles[4] == p && this.tiles[6] == p) ||
			(this.tiles[0] == p && this.tiles[4] == p && this.tiles[8] == p))
			return 1;

		//check if X has won
		p = -1;
		if ((this.tiles[0] == p && this.tiles[1] == p && this.tiles[2] == p) ||
			(this.tiles[3] == p && this.tiles[4] == p && this.tiles[5] == p) ||
			(this.tiles[6] == p && this.tiles[7] == p && this.tiles[8] == p) ||
			(this.tiles[0] == p && this.tiles[3] == p && this.tiles[6] == p) ||
			(this.tiles[1] == p && this.tiles[4] == p && this.tiles[7] == p) ||
			(this.tiles[2] == p && this.tiles[5] == p && this.tiles[8] == p) ||
			(this.tiles[2] == p && this.tiles[4] == p && this.tiles[6] == p) ||
			(this.tiles[0] == p && this.tiles[4] == p && this.tiles[8] == p))
			return 2;

		//check if there are any open spots left, if there are, the game is in progress
		for (let i = 0; i < 9; i++)
			if (this.tiles[i] == 0) return 0;

		//otherwise the game is over as a draw
		return 3;
	}
	/*
		returns a new board based on the child picked
		return null if there are no children
	*/
	next(child) {
		if (this.gameState != 0)
			return null;
		let skips = child;
		for (let i = 0; i < 9; i++) {
			if (this.tiles[i] == 0) {
				if (skips == 0)
				{
					let r = new Board(this.tiles, this.turn)
					return r.pickTile(i)
				}
				else
					skips--;
			}
		}
		return null;
	}
}

class Tree {
	constructor(board, depth, id, parent) {
		if (id == undefined)
			id = [1]
		if(parent == undefined)
			this.parent = null
		else
			this.parent = parent
		this.board = new Board(board.tiles, board.turn)
		this.children = new Array()
		this.id = id[0]++
		let i = 0
		if (depth > 0) {
			while(this.board.next(i))
				this.children.push(new Tree(this.board.next(i++), depth-1, id, this))
		}
	}
	search(id) {
		if (this.id == id) {
			//console.log("found", id)
			return this
		}
		for(let i = 0; i < this.children.length; i++) {
			if (i == this.children.length-1) {
				//console.log("reached end, searching last child")
				return this.children[i].search(id)
			}
			else if (this.children[i].id <= id && this.children[i+1].id > id) {
				//console.log("found bounded child", this.children[i].id, id, this.children[i+1].id)
				return this.children[i].search(id)
			}
			//console.log(id,this.children[i].id, this.children[i+1].id)
		}
	}
}

function evaluate(tree) {
	switch (tree.board.gameState) {
		case 1: return 2
		case 2: return 0
		case 3: return 1
		case 0: return undefined
		default: return undefined
	}
}

let results = []
let active = []

function minimax(tree) {
	let value = evaluate(tree)
	active.push([tree.id, value])
	results.push(active.slice(0))
	if (value != undefined) {
		return value
	}
	let best = (tree.board.turn == 1 ? -1 : 4)
	let which = 0
	for(let i = 0; i < tree.children.length; i++) {
		let result = minimax(tree.children[i])
		if (tree.board.turn == 1 ? result >= best : result <= best) {
			best = result
			which = i
		}
	}
	active = active.filter(id => id[0] != tree.id)
	active.push([tree.id, best])
	
	function remove(node) {
		active = active.filter(id => id[0] != node.id)
		let ele = active.find(id => id[0] == node.id)
		active.push([node.id, 4])
		for(let i = 0; i < node.children.length; i++)
			remove(node.children[i])
	}
	for(let i = 0; i < tree.children.length; i++) {
		if(i == which)
			continue
		remove(tree.children[i])
	}
	results.push(active.slice(0))
	return best
}

minimax(new Tree(new Board([0,0,-1,1,0,0,1,-1,1], -1), 5))

let abresults = []
let abactive = []

function alphabeta(tree, alpha, beta) {
	let value = evaluate(tree)
	abactive.push([tree.id, value])
	abresults.push(abactive.slice(0))
	if (value != undefined) {
		return value
	}
	let best = (tree.board.turn == 1 ? -1 : 4)
	let which = 0
	for(let i = 0; i < tree.children.length; i++) {
		let result = alphabeta(tree.children[i], alpha, beta)
		if (tree.board.turn == 1 ? result >= best : result <= best) {
			best = result
			which = i
		}
		if (tree.board.turn == 1 ? result >= alpha : result <= beta) {
			if (tree.board.turn == 1)
				alpha = result
			else
				beta = result
		}
		if (alpha >= beta)
			break
	}

	function remove(tree) {
		abactive = abactive.filter(id => id[0] != tree.id)
		for(let i = 0; i < tree.children.length; i++)
			remove(tree.children[i])
	}
	for(let i = 0; i < tree.children.length; i++) {
		if(i == which)
			continue
		remove(tree.children[i])
	}
	abactive = abactive.filter(id => id[0] != tree.id)
	abactive.push([tree.id, best])
	abresults.push(abactive.slice(0))
	return best
}
alphabeta(new Tree(new Board([0,0,-1,1,0,0,1,-1,1], -1), 5), -1, 4)

let abresultsR = []
let abactiveR = []

function alphabetaR(tree, alpha, beta) {
	let value = evaluate(tree)
	abactiveR.push([tree.id, value])
	abresultsR.push(abactiveR.slice(0))
	if (value != undefined) {
		return value
	}
	let best = (tree.board.turn == 1 ? -1 : 4)
	let which = 0
	for(let i = tree.children.length - 1; i >= 0; i--) {
		let result = alphabetaR(tree.children[i], alpha, beta)
		if (tree.board.turn == 1 ? result >= best : result <= best) {
			best = result
			which = i
		}
		if (tree.board.turn == 1 ? result >= alpha : result <= beta) {
			if (tree.board.turn == 1)
				alpha = result
			else
				beta = result
		}
		if (alpha >= beta)
			break
	}

	function remove(tree) {
		abactiveR = abactiveR.filter(id => id[0] != tree.id)
		for(let i = 0; i < tree.children.length; i++)
			remove(tree.children[i])
	}
	for(let i = 0; i < tree.children.length; i++) {
		if(i == which)
			continue
		remove(tree.children[i])
	}
	abactiveR = abactiveR.filter(id => id[0] != tree.id)
	abactiveR.push([tree.id, best])
	abresultsR.push(abactiveR.slice(0))
	return best
}

alphabetaR(new Tree(new Board([0,0,-1,1,0,0,1,-1,1], -1), 5), -1, 4)

let res_str =  "let states = " + JSON.stringify(results) + "\nlet abstates = " + JSON.stringify(abresults)  + "\nlet abstatesR = " + JSON.stringify(abresultsR)

let fs = require('fs');
fs.writeFile("Aimacode/Chapter5/states.js", res_str, function(err) {
	if(err)
		return console.log(err)
    console.log("The file was saved!")
})