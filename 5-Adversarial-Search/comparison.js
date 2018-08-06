function comparison() {
    let canvas = document.getElementById("comparisonCanvas");
    let canvasWidth = 1000;
    let canvasHeight = 1000;
    canvas.setAttribute("height", canvasHeight + "px");
    canvas.setAttribute("width",  canvasWidth+"px");
    canvas.setAttribute("style", "width: 100%; height: 40vw; margin: auto; display:block;");
    let ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(500,0);
    ctx.lineTo(500,1000);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0,500);
    ctx.lineTo(1000,500);
    ctx.stroke();

    let res = 25;
    let graph = [];
    
    for(let i = 0; i < res; i++) {
        graph.push(new Array(res));
        for(let j = 0; j < res; j++) {
            if(Math.random() < 0.8) {
                graph[i][j] = [];
            } else {
                graph[i][j] = undefined;
            }
        }
    }

    for(let i = 0; i < res; i++) {
        for(let j = 0; j < res; j++) {
            if (graph[i][j] != undefined) {
                /*
                if (i < 24 && graph[i+1][j] != undefined) {
                    graph[i][j].push([i+1, j]);
                }
                if (i < 24 && j < 24 && graph[i+1][j+1] != undefined) {
                    graph[i][j].push([i+1, j+1]);
                }
                if (i > 0 && j < 24 && graph[i-1][j+1] != undefined) {
                    graph[i][j].push([i-1, j+1]);
                }
                if (j < 24 && graph[i][j+1] != undefined) {
                    graph[i][j].push([i, j+1]);
                }
                */
                /*
                if (i < 24 &&  j > 0 && graph[i+1][j-1] != undefined) {
                    graph[i][j].push([i+1, j-1]);
                }
                
                if (j > 0 && graph[i][j-1] != undefined) {
                    graph[i][j].push([i, j-1]);
                }
                if (i > 0 && graph[i-1][j] != undefined) {
                    graph[i][j].push([i-1, j]);
                }
               
                if (i > 0 &&  j > 0 && graph[i-1][j-1] != undefined) {
                    graph[i][j].push([i-1, j-1]);
                }
                */
            }
        }
    }

    for(let i = 0; i < res; i++) {
        for(let j = 0; j < res; j++) {
            if (graph[i][j] != undefined && graph[i][j].length != 0) {
                ctx.rect(i*canvasWidth/res/2+3, j*canvasHeight/res/2+3, 3, 3);
                ctx.stroke();
                for(let k = 0; k < graph[i][j].length; k++) {
                    ctx.beginPath();
                    ctx.moveTo(i*canvasWidth/res/2+3,j*canvasHeight/res/2+3);
                    ctx.lineTo(graph[i][j][k][0]*canvasWidth/res/2+3,graph[i][j][k][1]*canvasWidth/res/2+3);
                    ctx.stroke();
                }
            }
        }
    }
    
    /*
        function setup() {
            function evaluate(tree) {
                switch (tree.board.gameState) {
                    case 1: return 2
                    case 2: return 0
                    case 3: return 1
                    case 0: return undefined
                    default: return undefined
                }
            }
            let graph = []
            let g1 = 0;
            let g2 = 0;
            let g3 = 0;
            let g4 = 0;
            function shuffle(a) {
                let j, x, i;
                for (i = a.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    x = a[i];
                    a[i] = a[j];
                    a[j] = x;
                }
                return a;
            }
            function draw_node(x, y, color) {
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = color;
                ctx.stroke();
            }
            function update_count(offsetx, offsety, count) {
                let x = 500;
                let y = 40;
                ctx.fillStyle="hsl(60,5%,95%)";
                //ctx.fillStyle="red";
                ctx.fillRect(x+offsetx,y+offsety-30,280,35); 

                ctx.fillStyle = 'hsl(0,0%,25%)';
                ctx.font = "30px Arial";
                ctx.textAlign="left"; 
                ctx.fillText("Nodes Visitied: " + count,x+offsetx,y+offsety);
            }
            async function minimax(index) {
                let node = graph[index];
                update_count(0,0,++g1);
                draw_node(node[1], node[2], 'hsl(0,100%,50%)');
                for(let i = 0; i < node[3].length; i++) {
                    await sleep(500);
                    await minimax(node[3][i]);
                }
            }
            async function alphabetaX(index, alpha, beta, r) {
                let node = graph[index];
                draw_node(node[1]+( r ? 0 : 800), node[2]+( r ? 250 : 0), 'hsl(0,100%,50%)');
                update_count(( r ? 0 : 800),( r ? 250 : 0),(r ? ++g3 : ++g2));
                if (node[3].length == 0) {
                    return node[0];
                }
                let best = 4;
                for(let i = ( r ? node[3].length-1 : 0); ( r ? i >= 0 :i < node[3].length); ( r ? i-- : i++)) {
                    await sleep(500);
                    let result = await alphabetaO(node[3][i], alpha, beta, r);
                    if (result <= best) {
                        best = result;
                    }
                    if (result <= beta) {
                        beta = result;
                    }
                    if (alpha >= beta) {
                        break;
                    }
                }
                return best;
            } 
            async function alphabetaO(index, alpha, beta, r, color) {
                let node = graph[index];
                draw_node(node[1]+( r ? 0 : 800), node[2]+( r ? 250 : 0), 'hsl(0,100%,50%)');
                update_count(( r ? 0 : 800),( r ? 250 : 0),(r ? ++g3 : ++g2));
                if (node[3].length == 0) {
                    return node[0];
                }
                let best = -1;
                for(let i = ( r ? node[3].length-1 : 0); ( r ? i >= 0 :i < node[3].length); ( r ? i-- : i++)) {
                    await sleep(500);
                    let result = await alphabetaX(node[3][i], alpha, beta, r);
                    if (result >= best) {
                        best = result;
                    }
                    if (result >= alpha) {
                        alpha = result;
                    }
                    if (alpha >= beta) {
                        break;
                    }
                }
                return best;
            }
            function ialphabetaX(index, alpha, beta, depth, color, first_picks) {
                return new Promise(async (resolve) => {
                //console.log('X depth', depth);
                //console.log(index, alpha, beta, depth, color, first_picks);
                let node = graph[index];
                update_count(800,250,++g4);
                draw_node(node[1]+800, node[2]+250, color);
                if (node[3].length == 0 || depth == 0) {
                    resolve([node[0], []]);
                    return;
                }
                let first = undefined;
                let which = 0;
                let best = [4,[]];
                if (first_picks.length > 0) {
                    first = first_picks[0];
                    best = await ialphabetaO(node[3][first], alpha, beta, depth-1, color, first_picks.slice(1));
                    alpha = best[0];
                    which = first;
                }
                for(let i = 0; i < node[3].length; i++) {
                    await sleep(500);
                    if (i == first) {
                        continue;
                    }
                    let result = await ialphabetaO(node[3][i], alpha, beta, depth-1, color, []);
                    if (result[0] <= best[0]) {
                        best = result;
                        which = i;
                    }
                    if (result[0] <= beta) {
                        beta = result[0];
                    }
                    if (alpha >= beta) {
                        break;
                    }
                }
                best[1].unshift(which);
                resolve(best);
            });
            }
            function ialphabetaO(index, alpha, beta, depth, color, first_picks) {
                return new Promise(async (resolve) => {
                //console.log('O depth', depth);
                //console.log(index, alpha, beta, depth, color, first_picks);

                //console.log('a');
                let node = graph[index];
                update_count(800,250,++g4);

                draw_node(node[1]+800, node[2]+250, color);
                if (node[3].length == 0 || depth == 0) {
                    //console.log('b');
                    resolve([node[0], []]);
                    return;
                }
                let first = undefined;
                let which = 0;
                let best = [-1,[]];
                if (first_picks.length > 0) {
                    //console.log('c');
                    first = first_picks[0];
                    best = await ialphabetaX(node[3][first], alpha, beta, depth-1, color, first_picks.slice(1));
                    alpha = best[0];
                    which = first;
                }
                for(let i = 0; i < node[3].length; i++) {
                    //console.log('O ' + i);
                    await sleep(500);
                    if (i == first) {
                        continue;
                    }
                    let result = await ialphabetaX(node[3][i], alpha, beta, depth-1, color, []);
                    if (result[0] >= best[0]) {
                        best = result;
                        which = i;
                    }
                    if (result[0] >= alpha) {
                        alpha = result[0];
                    }
                    if (alpha >= beta) {
                        break;
                    }
                }
                best[1].unshift(which);

                resolve(best);
            });
            }
            async function iterative() {
                let colors = ['red', 'purple', 'blue', 'green', 'yellow'];
                let best = [];
                for(let i = 0; i < colors.length; i++) {
                // console.log('main ' + i)
                    let result = await ialphabetaO(graph.length-1, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, i+1, colors[i-1], best);
                    if (result[0] == 3) {
                        break;
                    }
                    best = result[1];
                }
            }
            let choices = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8])
            let choice1 = choices.pop();
            let choice2 = choices.pop();
            let choice3 = choices.pop();
            let choice4 = choices.pop();
            let tiles = [0,0,0,0,0,0,0,0,0];
            tiles[choice1] = 1;
            tiles[choice2] = 1;
            tiles[choice3] = -1;
            tiles[choice4] = -1;
            let tree = new Tree(new Board(tiles, 1), 9)
            function make_graph(lx, ux, y, inc, node) {
                let result = [evaluate(node), (ux-lx)/2+lx, y, []];
                let b = node.children.length; 
                for(let i = 0; i < b; i++) {
                    let nux = (ux - lx)/b*(i+1)+lx;
                    let nlx = (ux - lx)/b*i+lx;
                    result[3].push(make_graph(nlx, nux, y+inc, inc*1.08, node.children[i]));
                }
                graph.push(result);
                return graph.length-1;
            }
            make_graph(5, 795, 60, 30, tree);
            function draw_graph(offsets) {
                //set up board
                {
                    ctx.beginPath();
                    ctx.lineWidth="3";
                    ctx.strokeStyle="hsl(0,0%,25%)";
                    ctx.rect(1,1,canvas.width-2,canvas.height-2); 
                    ctx.stroke();
            
                    ctx.beginPath();
                    ctx.moveTo(800,0);
                    ctx.lineTo(800,1000);
                    ctx.stroke();
            
                    ctx.beginPath();
                    ctx.moveTo(0,248);
                    ctx.lineTo(1600,248);
                    ctx.stroke();
                }
        
                //draw nodes and branches
                for (let offset of offsets) {
                    ctx.fillStyle = 'hsl(0,0%,25%)';
                    ctx.font = "30px Arial";
                    ctx.textAlign="left"; 
                    ctx.fillText(offset[2],15+offset[0],40+offset[1]);
                    for(let i = 0; i < graph.length; i++) {
                        let node = graph[i]
                        ctx.beginPath();
                        ctx.arc(node[1]+offset[0], node[2]+offset[1], 3, 0, 2 * Math.PI, false);
                        ctx.fillStyle = 'hsl(0,0%,25%)';
                        ctx.fill();
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = 'hsl(0,0%,25%)';
                        ctx.stroke();
            
                        ctx.lineWidth = 2;
                        for(let child of node[3]) {
                            ctx.beginPath();
                            ctx.moveTo(node[1]+offset[0],node[2]+offset[1]);
                            ctx.lineTo(graph[child][1]+offset[0],graph[child][2]+offset[1]);
                            ctx.stroke();
                        }
                    }
                }
            }
            draw_graph([[0,0, "Minimax"],[0,250, "Alpha-Beta R->L"],[800,0, "Alpha-Beta L->R"],[800,250, "Iterative Deepening"]]);
            minimax(graph.length-1);
            alphabetaO(graph.length-1, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, false);
            alphabetaO(graph.length-1, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, true);
            iterative();
        }
        
        setup();
    */
}