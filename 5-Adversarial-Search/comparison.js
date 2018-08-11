class GraphNode {
    constructor(x, y, leaf) {
        this.x = x;
        this.y = y;
        this.children = [];
        if (leaf) {
            this.value = Math.random();
        } else {
            this.value = undefined;
        }
    }
    draw(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(this.x+x,
            this.y+y,
            5,
            0,2*Math.PI);
        ctx.fillStyle = 'hsl(0,0%,50%)';
        ctx.fill();
        ctx.lineWidth = 0;
        ctx.strokeStyle = 'hsl(0,0%,50%)';
        ctx.stroke();

        for(let i = 0; i < this.children.length; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x+x,this.y+y);
            ctx.lineTo(this.children[i].x+x,this.children[i].y+y);
            ctx.stroke();
        }
    }
    add(other) {
        this.children.push(other);
    }

    mark(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(this.x+x,
            this.y+y,
            5,
            0,2*Math.PI);
        ctx.fillStyle = 'hsl(0,50%,50%)';
        ctx.fill();
        ctx.lineWidth = 0;
        ctx.stroke();
    }
}

class Graph {
    constructor(scale, nodes) {
        //construct nodes
        this.buckets = [];
        let xd = Math.floor(Math.sqrt(nodes));
        
        let res = scale/xd;
        for(let i = 0; i < xd; i++) {
            let row = [];
            for(let j = 0; j < xd; j++) {
                row.push(new GraphNode(i*res + 5 + Math.random()*(res-5), j*res + 5 + Math.random()*(res-5), (i == 0 ||  i == xd-1 || j == 0 || j == xd-1)));
            }
            this.buckets.push(row);
        }
        this.start = this.buckets[xd/2][xd/2];
        this.buckets[xd/2][xd/2].children.push(this.buckets[xd/2-1][xd/2-1]);
        this.buckets[xd/2][xd/2].children.push(this.buckets[xd/2-1][xd/2]);
        this.buckets[xd/2][xd/2].children.push(this.buckets[xd/2-1][xd/2+1]);
        this.buckets[xd/2][xd/2].children.push(this.buckets[xd/2][xd/2+1]);
        this.buckets[xd/2][xd/2].children.push(this.buckets[xd/2+1][xd/2+1]);
        this.buckets[xd/2][xd/2].children.push(this.buckets[xd/2+1][xd/2]);
        this.buckets[xd/2][xd/2].children.push(this.buckets[xd/2+1][xd/2-1]);
        this.buckets[xd/2][xd/2].children.push(this.buckets[xd/2][xd/2-1]);

        this.buckets[xd/2+1][xd/2+1].children.push(this.buckets[xd/2+2][xd/2+1]);
        this.buckets[xd/2-1][xd/2+1].children.push(this.buckets[xd/2-2][xd/2+1]);

        //add their branches
        for(let i = 0; i < this.buckets.length; i++) {
            for(let j = 0; j < this.buckets[i].length; j++) {
                if (i == xd/2 && j == xd/2) {
                    continue;
                }
                if (i > xd/2 && i < xd-1) {
                    if (j > xd/2 && j < xd-1) { //bottom right
                        this.buckets[i][j].add(this.buckets[i+1][j+1]);
                        if (i/j > 1) {
                            this.buckets[i][j].add(this.buckets[i+1][j]);
                        } else {
                            this.buckets[i][j].add(this.buckets[i][j+1]);
                        }
                    } else if (j > 0) { //top right
                        this.buckets[i][j].add(this.buckets[i+1][j-1]);
                        if ((i-xd/2)/(xd/2-j) > 1) {
                            this.buckets[i][j].add(this.buckets[i+1][j]);
                        } else {
                            this.buckets[i][j].add(this.buckets[i][j-1]);
                        }
                    }
                } else if (i > 0) {
                    if (j > xd/2 && j < xd-1) { //bottom left
                        this.buckets[i][j].add(this.buckets[i-1][j+1]);
                        if ((i-xd/2)/(xd/2-j) > 1) {
                            this.buckets[i][j].add(this.buckets[i-1][j]);
                        } else {
                            this.buckets[i][j].add(this.buckets[i][j+1]);
                        }
                    } else if (j > 0) { // top left
                        this.buckets[i][j].add(this.buckets[i-1][j-1]);
                        if (i/j < 1) {
                            this.buckets[i][j].add(this.buckets[i-1][j]);
                        } else {
                            this.buckets[i][j].add(this.buckets[i][j-1]);
                        }
                    }
                }

                
            }
        }
    }
    draw(ctx, x, y) {
        for(let i = 0; i < this.buckets.length; i++) {
            for(let j = 0; j < this.buckets[i].length; j++) {
                this.buckets[i][j].draw(ctx, x, y);
            }
        }
    }
}

function* comp_minimax(node, ctx, x, y) {
    if (node.minimax == true) {
        return;
    }
    node.minimax = true;
    node.mark(ctx, x, y);
    yield;
    for(let i = 0; i < node.children.length; i++) {
        yield *comp_minimax(node.children[i], ctx, x, y);
    }
}
function* comp_alphabeta(node, ctx, x, y, turn = true, alpha = Number.MIN_VALUE, beta =  Number.MAX_VALUE) {
    if (node.alphabeta == true) {
        return turn ? Number.MIN_VALUE :  Number.MAX_VALUE;
    }
    node.alphabeta = true;
    node.mark(ctx, x, y);
    yield;
    if (node.value != undefined) {
        return node.value;
    }
    if (turn == true) {
        let value = Number.MIN_VALUE;
        for(let i = 0; i < node.children.length; i++) {
            value = Math.max(value, yield *comp_alphabeta(node.children[i], ctx, x, y, false, alpha, beta));
            alpha = Math.max(alpha, value);
            if (alpha >= beta) {
                break;
            }
        }
        return value;
    } else {
        let value = Number.MAX_VALUE;
        for(let i = 0; i < node.children.length; i++) {
            value = Math.min(value, yield *comp_alphabeta(node.children[i], ctx, x, y, true, alpha, beta));
            beta = Math.min(beta, value);
            if (alpha >= beta) {
                break;
            }
        }
        return value;
    }
}
function* comp_alphabetar(node, ctx, x, y, turn = true, alpha = Number.MIN_VALUE, beta =  Number.MAX_VALUE) {
    if (node.alphabetaR == true) {
        return turn ? Number.MIN_VALUE :  Number.MAX_VALUE;
    }
    node.alphabetaR = true;
    node.mark(ctx, x, y);
    yield;
    if (node.value != undefined) {
        return node.value;
    }
    if (turn == true) {
        let value = Number.MIN_VALUE;
        for(let i = node.children.length-1; i >= 0 ; i--) {
            value = Math.max(value, yield *comp_alphabetar(node.children[i], ctx, x, y, false, alpha, beta));
            alpha = Math.max(alpha, value);
            if (alpha >= beta) {
                break;
            }
        }
        return value;
    } else {
        let value = Number.MAX_VALUE;
        for(let i = node.children.length-1; i >= 0 ; i--) {
            value = Math.min(value, yield *comp_alphabetar(node.children[i], ctx, x, y, true, alpha, beta));
            beta = Math.min(beta, value);
            if (alpha >= beta) {
                break;
            }
        }
        return value;
    }
}
function* comp_alphabetai(node, ctx, x, y, depth) {
    function* helper(depth, turn = true, alpha = Number.MIN_VALUE, beta =  Number.MAX_VALUE) {
        if (node.alphabetai == true) {
            return turn ? Number.MIN_VALUE :  Number.MAX_VALUE;
        }
        node.alphabetai = true;
        node.mark(ctx, x, y);
        yield;
        if (node.value != undefined) {
            return node.value;
        }
        if (turn == true) {
            let value = Number.MIN_VALUE;
            for(let i = 0; i < node.children.length; i++) {
                value = Math.max(value, yield *comp_alphabetai(node.children[i], ctx, x, y, false, alpha, beta));
                alpha = Math.max(alpha, value);
                if (alpha >= beta) {
                    break;
                }
            }
            return value;
        } else {
            let value = Number.MAX_VALUE;
            for(let i = 0; i < node.children.length; i++) {
                value = Math.min(value, yield *comp_alphabetai(node.children[i], ctx, x, y, true, alpha, beta));
                beta = Math.min(beta, value);
                if (alpha >= beta) {
                    break;
                }
            }
            return value;
        }
    }
    for(let i = 0; i < depth; i++) {
        helper(i);
    }    
}
function comparison() {
    let canvas = document.getElementById("comparisonCanvas");
    let canvasWidth = 1000;
    let canvasHeight = 1000;
    canvas.setAttribute("height", canvasHeight + "px");
    canvas.setAttribute("width",  canvasWidth+"px");
    canvas.setAttribute("style", "width: 100%; height: 40vw; margin: auto; display:block;");
    let ctx = canvas.getContext("2d");

    let int;
    function setup() {
        clearInterval(int);

        ctx.fillStyle = 'hsl(60,5%,95%)';
        ctx.fillRect(0,0,1000,1000);

        ctx.beginPath();
        ctx.moveTo(500,0);
        ctx.lineTo(500,1000);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0,500);
        ctx.lineTo(1000,500);
        ctx.stroke();

        let graph = new Graph(500, 800);
        graph.draw(ctx, 0, 0);
        graph.draw(ctx, 0, 500);
        graph.draw(ctx, 500, 500);
        graph.draw(ctx, 500, 0);
    
        let mini = comp_minimax(graph.start, ctx, 0, 0);
        let ab = comp_alphabeta(graph.start, ctx, 0, 500);
        let abr = comp_alphabetar(graph.start, ctx, 500, 500);
        let abi = comp_alphabetai(graph.start, ctx, 500, 0);
    
        int = setInterval(()=>{
            mini.next();
            ab.next();
            abr.next();
            abi.next();
        }, 10);
    }
    setup();
    let button = document.getElementById("playButton");
    button.onclick = setup;
}