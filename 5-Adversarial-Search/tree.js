function minimax(tree) {
	switch (tree.board.gameState) {
		case 1: return [2, undefined]
		case 2: return [0, undefined]
		case 3: return [1, undefined]
	}
	let best = (tree.board.turn == 1 ? -1 : 4)
	let move = 0
	for(let i = 0; i < tree.children.length; i++) {
		let result = minimax(tree.children[i])[0]
		if (tree.board.turn == 1 ? result >= best : result <= best) {
			best = result
			move = i
		}
	}
	return [best, move]
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
			return this
		}
		for(let i = 0; i < this.children.length; i++) {
			if (i == this.children.length-1) {
				return this.children[i].search(id)
			}
			else if (this.children[i].id <= id && this.children[i+1].id > id) {
				return this.children[i].search(id)
			}
		}
	}
}