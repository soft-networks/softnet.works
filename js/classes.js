
/***
 * CONSTANTS
 */


 let GRID_SIZE = 256;
 let DEBUG = false;
 let MAX_DEPTH = 4;
 let LEAF_DEPTH = 10;
 let BRANCH_LENGTH = 5;
 const cellsize = 2;
 
 let LOGO_PARAMS = {
   initAngle: PI / 6.28,
   params: {
     bendAngle: PI / 24,
     longTrunk: 4,
     longBranch: 3,
     forcedStrayBranch: true
   },
 };
 
let ICON_PARAMS = {
  initAngle: PI / 4.28,
  params: {
    bendAngle: PI / 24,
    longTrunk: 4,
    longBranch: 3,
    forcedStrayBranch: true
  },
};


let USE_BW_COLORS = true;

let PALETTE = {
  leafBrown: "#AD9381",
  fruitBrown: "#75492B",
  pink: "#FF9EE5",
  darkGreen: "rgb(70, 116, 91)",
  black: "#000000",
  leafGray: "rgb(200,200,200)",
  fruitGray: "rgb(100,100,100)",
}

//Black and white 
let BGCOLOR =  undefined;
let COL1 = PALETTE.black;
let MAIN_HIGHLIGHT_COLOR = PALETTE.leafGray;
let HIGHLIGHTCOLORS = [PALETTE.pink, PALETTE.pink];


if (!USE_BW_COLORS) {
  //Blue bg
  MAIN_HIGHLIGHT_COLOR = PALETTE.darkGreen;
  HIGHLIGHTCOLORS = [PALETTE.pink, PALETTE.pink];
}


/* GRID, contains cells corresponding to pixels */ 
class Grid {
  constructor(nr, nc) {
    this.cells = [];
    this.nCols = nr;
    this.nRows = nc;

    for (let i = 0; i < this.nRows; i++) {
      for (let j = 0; j < this.nCols; j++) {

        this.cells.push(0);
      }
    }
    this.newCells = [];
  }
  addToGrid(x, y, n = 1) {
    if (x < 0 || y < 0 || x > this.nCols || y > this.nRows) {
      return;
    }
    this.cells[x + y * this.nCols] = n;
    this.newCells.push({xi: x, yi: y, n: n});
  }
  getNewCells() {
    // console.log(this.newCells);
    let returning = [...this.newCells];
    this.newCells = [];
    return returning;
  }
  addLineToGrid(pos, angle, length, n, width) {
    let runningpos = pos;
    for (let i = 0; i < length; i++) {
      runningpos = cv(runningpos.x + cos(angle), runningpos.y + sin(angle));

      if (width && width !== 1 ) {
        for (let i =1 ; i<= round(width/2); i++) {
        let orthogonalLeft = cv(runningpos.x + i * cos(angle + PI / 2), runningpos.y + i * sin(angle + PI / 2));
        this.addToGrid(round(orthogonalLeft.x), round(orthogonalLeft.y), n);
        
        let orthogonalRight = cv(runningpos.x + i * cos(angle - PI / 2), runningpos.y + i * sin(angle - PI / 2));
        this.addToGrid(round(orthogonalRight.x), round(orthogonalRight.y), n);
      
      }
        
      }
      
      this.addToGrid(round(runningpos.x), round(runningpos.y), n);
    }
  }
  debug = () => {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i]) {
        let x = i % this.nCols;
        let y = floor(i / this.nCols);
        //console.log("x/y is true", x, y);
      }
    }
  };
  isOnGrid(x, y) {
    return this.cells[x + y * this.nCols];
  }
  mapPosToGrid(pos) {
    return cv(round(pos.x), round(pos.y));
  }
  getEmptyAdjacentCell(x,y){
    let emptyCell = null;
    //returns a diagonal cell if it is empty
    let adjCells = [
      {x:x+1, y:y+1},
      {x:x+1, y:y-1},
      {x:x-1, y:y-1},
      {x:x-1, y:y+1},
    ];
    shuffleArray(adjCells);
    for (let i = 0; i < adjCells.length; i++) {
      let cell = adjCells[i];
      if (!this.isOnGrid(cell.x, cell.y)) {
        emptyCell = cell;
        break;
      }
    }
    return emptyCell;
  }
  isOut(pos) {
    let isOut =  pos.x > this.nCols|| pos.y > this.nRows || pos.y < 0 || pos.x < 0;
    if (isOut) {
      // console.log("out");
    }
    return isOut
  }
  getRandomPoint() {
    let x = floor(rnd(0, this.nCols));
    let y = floor(rnd(0, this.nRows));
    return cv(x, y);
  }
}


/* Tree : Over many iterations, draws a branching tree into a grid */
class Tree {
  constructor(grid, branchAngle, initLength, initPos, { bendAngle, longTrunk, longBranch, forcedStrayBranch } = {}) {
    this.grid = grid;
    let p0 = initPos ? initPos : cv(round(grid.nCols / 2), round(grid.nRows * 0.77));
    this.angle = branchAngle || PI / 4;

    this.longTrunk = longTrunk;
    this.bendAngle = bendAngle || 0;
    // this.branches = [[]];
    this.branches = [{ pos: p0, index: 0, l: initLength, depth: 0, angle: -PI / 2 + this.bendAngle, w: 1 }];
    this.longBranch = longBranch || 5;
    this.forcedStrayBranch = forcedStrayBranch;
  }
  branchNode(node, singleBranch) {
    let lnode = {
      ...node,
      angle: !singleBranch ? node.angle - this.angle : node.angle + (fliprn() * this.angle),
      depth: node.depth + 1,
      branchEnded: false,
      index: 0,
      l: max(node.l - 1, 1),
      w: max(node.w / 2, 1),
    };
    this.branches.push(lnode);
    if (!singleBranch) {
      let rnode = {
        ...node,
        angle: node.angle + this.angle,
        depth: node.depth + 1,
        branchEnded: false,
        index: 0,
        l: max(node.l - 1, 1),
        w: max(node.w / 2, 1),
      };
      this.branches.push(rnode);
    }
  }
  ifCollideCloseOut(newNode, oldNode) {
    if (this.grid.isOnGrid(newNode.pos.x, newNode.pos.y)) {
      oldNode.branchEnded = true;
      oldNode.hasCollided = true;
      return true;
    }
    return false;
  }
  addLeaf(node, branchIndex) {
    if (node.leafIndex == undefined || node.leafIndex < LEAF_DEPTH) {
      let mindex = this.grid.mapPosToGrid(node.pos);
      let adjacentEmpty = this.grid.getEmptyAdjacentCell(mindex.x, mindex.y);
      if (adjacentEmpty) {
        let flowerIndex = floor(rn(2, 3.2));
        this.grid.addToGrid(adjacentEmpty.x, adjacentEmpty.y, flowerIndex);
        let nextLeafIndex = node.leafIndex !== undefined ? node.leafIndex + 1 : 0;
        nextLeafIndex = flowerIndex == 3 ? LEAF_DEPTH : nextLeafIndex;
        this.branches[branchIndex] = { ...node, pos: adjacentEmpty, leafIndex: nextLeafIndex };
      }
    }
  }
  continueNode(lastNode, branchIndex, n) {
    let newPos = cv(
      round(lastNode.pos.x + cos(lastNode.angle) * lastNode.l),
      round(lastNode.pos.y + sin(lastNode.angle) * lastNode.l)
    );

    let newNode = {
      ...lastNode,
      pos: newPos,
      index: lastNode.index + 1,
      w: max(lastNode.w - 1, 1),
      angle: lastNode.angle,
    };
    if (this.ifCollideCloseOut(newNode, lastNode)) {
      return;
    };
    if (lastNode.depth == 0 && !lastNode.strayBranch && lastNode.index > 1 && (rnd(0,10) > 8 || this.forcedStrayBranch)) {
      let stray = {...lastNode, index: lastNode.index + 2}
      this.branchNode(stray, true)
      newNode.strayBranch = true;
    }
    this.branches[branchIndex] = newNode;
    this.grid.addLineToGrid(lastNode.pos, newNode.angle, newNode.l, n, lastNode.w);
  }
  grow() {
    //console.log(this.branches);
    for (let b = 0; b < this.branches.length; b++) {
      let lastNode = this.branches[b];
      if (lastNode.branchEnded || lastNode.depth > MAX_DEPTH || this.grid.isOut(lastNode.pos)) {
        if (lastNode.depth > 0 || lastNode.hasCollided) {
          this.addLeaf(lastNode, b);
        }
        continue;
      }
      let shouldBranch;
      if (this.longTrunk && lastNode.depth == 0) shouldBranch = lastNode.index > this.longTrunk;
      else shouldBranch = (lastNode.index >= 2 && rnd(0, 10) > 4) || lastNode.index > this.longBranch;
      if (shouldBranch) {
        lastNode.branchEnded = true;
        this.branchNode(lastNode);
      } else {
        //Continue by length
        this.continueNode(lastNode, b);
      }
    }
  }
}

/* DrawGrid: Given a grid and a p5 js instance variable, helps to draw the grid into it */
class DrawGrid {
  constructor(p, grid,  cellsize ) {
    this.p = p;
    this.grid = grid;
    this.cellsize = cellsize ;
  }

  drawNew() {
    let nc = this.grid.getNewCells();
    for (let cell of nc) {
      this.drawCell( cell.xi, cell.yi, cell.n);
    }
  }
  drawAll() {
    let cells = this.grid.cells;
    this.p.clear();
    for (let i = 0; i < cells.length; i++) {
      //this.p.stroke("grey");
      let xi = i % this.grid.nCols;
      let yi = floor(i /this.grid.nCols);
      this.drawCell( xi, yi, cells[i]);
    }
  }
  drawCell(xi, yi, n) {
    let p = this.p;
    p.rectMode(p.CENTER);
    p.push();
    switch (n) {
      case 0:
        p.noFill();
        break;
      case 1:
        p.fill(COL1);
        break;
      case 2:
        p.fill(MAIN_HIGHLIGHT_COLOR);
        break;
      case 3:
        p.fill(HIGHLIGHTCOLORS[0]);
        break;
      case 4:
        p.fill(HIGHLIGHTCOLORS[1]);
        break;
      case "x":
        p.erase();
        p.rect(xi * this.cellsize, yi * this.cellsize, this.cellsize , this.cellsize + 1.5 );
        p.noErase();
        p.pop();
        return;
    }
    p.rect(xi * this.cellsize, yi * this.cellsize, this.cellsize, this.cellsize);
    p.pop();
  }
}

/* Helper functions to manage forests, simple dust particles, etc */

function growTrees(trees) {
  for (let tree of trees) {
    tree.grow();
  }
}
function addNewTree(n, grid, trees) {
  let p = cv(n, grid.nRows );
  let nt = new Tree(grid, rnd(PI / 15, PI / 4), BRANCH_LENGTH, p, {
    bendAngle: (PI / rnd(8, 12)) * fliprn(),
    longTrunk: rnd(3, 5),
    longBranch: rnd(2,3)
  });
  trees.push(nt);
}
function forest( grid, trees) {
  addNewTree(grid.nCols * rnd(0.1, 0.8), grid, trees);
  if (trees.length < 10)
    setTimeout(() => forest(grid, trees), rnd(3000, 8000));
}

function growForest(grid, trees) {
  setTimeout(() => forest(grid, trees), rnd(3000, 8000));
}

function moveAndDrawDust(dustList, drawHelper) {
  // const wind = cv(1, map(drawHelper.p.noise(drawHelper.p.frameCount / 100) - 0.5) * 2);
  const wind = cv(1, rnd(-1,1));
  let wos = dustList;
  for (let i = 0; i < wos.length; i++) {
    let wi = wos[i];
    let c = drawHelper.grid.isOnGrid(wi.x, wi.y);
    drawHelper.drawCell( wos[i].x, wos[i].y, c || "x");

    wos[i] = addv(wos[i], wind);
    wos[i] = cv(round(wos[i].x), round(wos[i].y));

    let wo = wos[i];
    if (wo.x > drawHelper.grid.nCols) {
      wo.x = 0;
    }
    drawHelper.drawCell( wo.x, wo.y, 4);
  }
}