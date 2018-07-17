function draw_line(x1, y1, x2, y2, canvas, scale) {
	let line = document.createElementNS("http://www.w3.org/2000/svg", 'line')
	canvas.appendChild(line)
	line.setAttribute('x1', x1 )
	line.setAttribute('y1', y1)
	line.setAttribute('x2', x2)
	line.setAttribute('y2', y2)
	line.setAttribute('stroke', 'hsl(0,0%,30%)')
	line.setAttribute('stroke-width', (scale == undefined ? 1 : scale/20))
	return line
}
function draw_circle(x, y, scale, canvas, scale) {
	let circle = document.createElementNS("http://www.w3.org/2000/svg", 'path')
	canvas.appendChild(circle)
	let r = scale/10
	let place = "M " + (x) + ", " + (y) + " m " + (-1*r) + ", 0 a "+r+", "+r+" 0 1, 0 "+ ( 2 * r) + ", 0 a "+r+", "+r+" 0 1,0 " + ( -2 * r) + ",0"
	circle.setAttribute('d', place)
	circle.setAttribute('fill', 'none')
	circle.setAttribute('stroke', 'hsl(120, 50%, 50%)')
	circle.setAttribute('style', 'stroke-dasharray: 1000; stroke-dashoffset: 1000;  pointer-events: none;')
	circle.setAttribute('stroke-width', (scale == undefined ? 1 : scale/20))

	return circle
}
function draw_cross(x, y, scale, canvas, scale) {
	let cross = document.createElementNS("http://www.w3.org/2000/svg", 'path')
	canvas.appendChild(cross)
	let offset = scale/10
	let place = "M " + (x - offset) + ", " + (y - offset) +" L " + (x + offset) + ", " + (y + offset)+" M " + (x + offset)+ " " + (y - offset) +" L " + (x - offset) + " " + (y + offset)
	cross.setAttribute('d', place)
	cross.setAttribute('stroke', 'hsl(0, 50%, 50%)')
	cross.setAttribute('style', 'stroke-dasharray: 1000; stroke-dashoffset: 1000;  pointer-events: none;')
	cross.setAttribute('stroke-width', scale/20)
	return cross
}
function draw_text(x, y, text, cls, canvas) {
	let textele = document.createElementNS('http://www.w3.org/2000/svg','text')
	let textnode = document.createTextNode(text)
	textele.setAttribute('x', x)
	textele.setAttribute('y', y)
	textele.setAttribute('alignment-baseline', 'middle')
	textele.setAttribute('text-anchor', 'middle')
	//textele.setAttribute('style', ' font-size: ' + size + 'em;')
	textele.setAttribute('class', cls)
	textele.appendChild(textnode)
	canvas.appendChild(textele)
	return textele
}
class BoardGraphic {
	constructor(board, x, y, canvas, size) {
		this.scale = (size == undefined ? 20 : size)
		this.group = document.createElementNS("http://www.w3.org/2000/svg", 'g')
		canvas.appendChild(this.group)
		this.rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect')
		this.group.appendChild(this.rect)
		{
			this.rect.setAttribute('x', x-this.scale/2)
			this.rect.setAttribute('y', y-this.scale/2)
			this.rect.setAttribute('width', this.scale)
			this.rect.setAttribute('height', this.scale)
			this.rect.setAttribute('height', this.scale)
			this.rect.setAttribute('fill', 'hsl(0,0%,100%)')
			this.rect.setAttribute('stroke', 'hsl(0,0%,30%)')
			this.rect.setAttribute('stroke-width', this.scale/20)
		}
		{
			this.l1 = draw_line((this.scale/3 + x - this.scale/2),
								(0 + y - this.scale/2),
								(this.scale/3 + x - this.scale/2),
								(this.scale + y - this.scale/2),
								this.group,
								this.scale)
			this.l2 = draw_line((this.scale/3*2 + x - this.scale/2),
								(0 + y - this.scale/2),
								(this.scale/3*2 + x - this.scale/2),
								(this.scale + y - this.scale/2),
								this.group,
								this.scale)
			this.l3 = draw_line((0 + x - this.scale/2),
								(this.scale/3 + y - this.scale/2),
								(this.scale + x - this.scale/2),
								(this.scale/3 + y - this.scale/2),
								this.group,
								this.scale)
			this.l4 = draw_line((0+ x - this.scale/2),
								(this.scale/3*2 + y - this.scale/2),
								(this.scale + x - this.scale/2),
								(this.scale/3*2 + y - this.scale/2),
								this.group,
								this.scale)
		}
		this.circle_marks = []
		this.cross_marks = []
		for(let i = 0; i < 9; i++) {
			this.circle_marks.push(draw_circle((i%3*this.scale/3 - this.scale/3 + x),
												(Math.floor(i/3)*this.scale/3 - this.scale/3 + y),
												this.scale,
												this.group,
												this.scale))
			this.cross_marks.push(draw_cross((i%3*this.scale/3 - this.scale/3 + x),
												(Math.floor(i/3)*this.scale/3 - this.scale/3 + y),
												this.scale,
												this.group,
												this.scale))
			switch(board.tiles[i]) {
			case -1: this.cross_marks[i].setAttribute('class', 'gameapp'); break
			case 0: break
			case 1: this.circle_marks[i].setAttribute('class', 'gameapp'); break
			}
		}
		/*
			0 = in progress
			1 = O won
			2 = X won
			3 = draw
		*/
		let msg = undefined
		switch(board.gameState) {
			case 0: msg = "Draw!"; break
			case 1: msg = "O won!"; break
			case 2: msg = "X won!"; break
			case 3: msg = "Draw!"; break
		}
		this.message = draw_text(x, y, msg, 'board_status', canvas)
		this.group.appendChild(this.message)
	}
}

class Highlight {
	constructor(fill, outline, mark, mask, size, color, opacity){
		this.content = {}
		this.fill = fill
		this.outline = outline
		this.mark = mark
		this.mask = mask
		this.size = size
		this.color = color
		this.opacity = opacity
	}

	SetBoard(id, fill, outline, mark, mask, opacity){
		this.content[id] = {
			'fill' : fill,
			'outline' : outline,
			'mark' : mark,
			'mask' : mask,
			'opacity' : opacity
		}
	}

	RemoveBoard(id) {
		delete this.content[id]
	}

	GetBoardFill(id, tile) {
		if (this.content[id] != undefined && this.content[id].mask[tile] == 1)
			return this.content[id].fill
		if (this.fill != undefined)
			return this.fill
		return 'white'
	}

	GetBoardOutline(id, tile) {
		if (this.content[id] != undefined)
			return this.content[id].outline
		if (this.outline != undefined)	
			return this.outline
		return 'black'
	}

	GetBoardMark(id, tile) {
		if (this.content[id] != undefined)
			return this.content[id].mark
		if (this.mark != undefined)
			return this.mark
		return 'black'
	}

	SetBranch(from, to, color, size, opacity) {
		this.content[from + ' ' + to] = {
			'color' : color,
			'size' : size,
			'opacity' : opacity
		}
	}

	RemoveBranch(from, to, tile) {
		delete this.content[from + ' ' + to]
	}

	GetBranchColor(from, to) {
		if (this.content[from + ' ' + to] != undefined)
			return this.content[from + ' ' + to].color
		if (this.color != undefined)
			return this.color
		return 'black'
	}

	GetBranchSize(from, to) {
		if (this.content[from + ' ' + to] != undefined)
			return this.content[from + ' ' + to].size
		if (this.size != undefined)
			return this.size
		return 1
	}

	GetBranchSize(from, to) {
		if (this.content[from + ' ' + to] != undefined)
			return this.content[from + ' ' + to].size
		if (this.size != undefined)
			return this.size
		return 1
	}

	GetBoardOpacity(id, tile) {
		if (this.content[id] != undefined) {
			if (this.content[id].opacity != undefined)
				return this.content[id].opacity
			else
				return 1
		}
			
		if (this.opacity != undefined)
			return this.opacity
		return 1
	}

	GetBranchOpacity(from, to) {
		if (this.content[from + ' ' + to] != undefined) {
			if (this.content[from + ' ' + to].opacity != undefined)
				return this.content[from + ' ' + to].opacity
			else
				return 1
		}
			
		if (this.opacity != undefined)
			return this.opacity
		return 1
	}
}

function drawBoard(name, node, two, nodesize, highlight, xp, yp, offset, name, disabled){
	for (let i = 0; i < 9; i++) {
		let x = (i%3)*(nodesize/3)+xp/2+offset
		let y = Math.floor(i/3)*(nodesize/3)+yp
		let rect = two.makeRectangle(x, y, nodesize/3, nodesize/3)
		rect.opacity = highlight.GetBoardOpacity(node.id, i)
		if (highlight != undefined)
		{
			rect.fill = highlight.GetBoardFill(node.id, i)
			rect.stroke = highlight.GetBoardOutline(node.id, i)
		}
		if (node.board.tiles[i] == 1)
		{
			let m = two.makeCircle(x, y, nodesize/10)
			m.opacity = highlight.GetBoardOpacity(node.id, i)
			if (highlight != undefined) {
				m.fill = 'none'
				m.stroke = highlight.GetBoardMark(node.id, i)
			}
		}
		else if (node.board.tiles[i] == -1){
			let s = 10;
			let m = two.makeLine(x-nodesize/s, y-nodesize/s, x+nodesize/s, y+nodesize/s)
			m.opacity = highlight.GetBoardOpacity(node.id, i)
			if (highlight != undefined)
				m.stroke = highlight.GetBoardMark(node.id)
			m = two.makeLine(x-nodesize/s, y+nodesize/s, x+nodesize/s, y-nodesize/s)
			m.opacity = highlight.GetBoardOpacity(node.id, i)
			if (highlight != undefined)
				m.stroke = highlight.GetBoardMark(node.id)
		}

		two.update()

		let eventleave  = new CustomEvent(name+"leave", { detail: [node.id, i] })
		let evententer  = new CustomEvent(name+"enter", { detail: [node.id, i] })
		let eventclick  = new CustomEvent(name+"click", { detail: [node.id, i] })

		$(rect._renderer.elem).attr('id', i)
		$(rect._renderer.elem)
			.css('cursor', 'pointer')
			.mouseleave((e)=>{ document.dispatchEvent(eventleave) })
			.mouseenter((e)=>{ document.dispatchEvent(evententer) })
			.click((e)=>{ document.dispatchEvent(eventclick) })

		two.update()

	}
}

function drawTree(name, tree, two, nodesize, dampen, depth, highlight, disabled) {

	let potential_max_width = Math.pow(tree.children.length, depth)*nodesize*1.7/dampen;

	const breath_first_draw = (node, xp, yp, offset)=> {

		drawBoard(name, node, two, nodesize, highlight, xp, yp, offset, name, disabled);

		for (let i = 0; i < node.children.length; i++) {
			let b = two.makeLine(xp/2+offset+nodesize/3, yp+nodesize*5/6, (xp/node.children.length/2)+(nodesize/3)+offset+(i*xp/node.children.length), yp+nodesize*1.3-nodesize/6);
			if (highlight != undefined) {
				b.stroke = highlight.GetBranchColor(node.id, node.children[i].id)
				b.linewidth = highlight.GetBranchSize(node.id, node.children[i].id)
				b.opacity = highlight.GetBranchOpacity(node.id, node.children[i].id)
			}
			breath_first_draw(node.children[i], xp/node.children.length, yp+nodesize*1.3, offset+i*xp/node.children.length);
		}
	}

	breath_first_draw(tree, potential_max_width, nodesize/2, 0);
	two.update();
}