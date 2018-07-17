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