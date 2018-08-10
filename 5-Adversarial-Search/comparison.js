class GraphNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.children = [];
    }
    draw(ctx, x, y, leaf) {
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
            ctx.moveTo(this.x,this.y);
            ctx.lineTo(this.children[i].x,this.children[i].y);
            ctx.stroke();
        }
        if (leaf) {
            this.value = Math.random();
        } else {
            this.value = undefined;
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
        //add their branches
        for(let i = 0; i < this.buckets.length; i++) {
            for(let j = 0; j < this.buckets[i].length; j++) {
                if (i > 0) {
                    this.buckets[i][j].add(this.buckets[i-1][j]);
                }
                if (i < this.buckets.length-1) {
                    this.buckets[i][j].add(this.buckets[i+1][j]);
                }
                if (j > 0) {
                    this.buckets[i][j].add(this.buckets[i][j-1]);
                }
                if (j < this.buckets[i].length-1) {
                    this.buckets[i][j].add(this.buckets[i][j+1]);
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
async function comparison() {
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
    
        let mini = comp_minimax(graph.start, ctx, 0, 0);
    
        int = setInterval(()=>{
            mini.next();
        }, 100);
    }
    setup();
    let button = document.getElementById("playButton");
    button.onclick = setup;
}