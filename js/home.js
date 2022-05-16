const homesketch = (p) => {
  const containerSize = document.getElementById("canvas-container").offsetWidth * 1.02;
  const canvassize = containerSize;
  // const canvassize = 512;
  // GRID_SIZE = Math.min(canvassize / cellsize, GRID_SIZE);
  GRID_SIZE = floor(canvassize / cellsize);
  console.log(GRID_SIZE)
  const canvasaspect = 3.6;

  let grid = new Grid(GRID_SIZE, GRID_SIZE / canvasaspect);
  let trees = [];
  let windObjects = [];
  let drawHelper = new DrawGrid(p, grid, cellsize);

  function homeSetup() {
    trees.push(
      new Tree(grid, LOGO_PARAMS.initAngle, BRANCH_LENGTH, cv(grid.nCols * 0.1, grid.nRows), LOGO_PARAMS.params)
    );
    trees.push(
      new Tree(grid, LOGO_PARAMS.initAngle, BRANCH_LENGTH, cv(grid.nCols * 0.8, grid.nRows), LOGO_PARAMS.params)
    );
    growForest(grid, trees);
    for (let i = 0; i < 5; i++) {
      windObjects.push(cv(grid.nCols / rnd(1, 10), grid.nRows - BRANCH_LENGTH * MAX_DEPTH * 1.5 + rnd(-5, 5)));
    }
  }
  p.setup = () => {
    console.log("lets go");
    homeSetup();
    canvas = p.createCanvas(canvassize, canvassize / canvasaspect);
    canvas.parent("#canvas-container");
    canvas.imageSmoothingEnabled = false;
    p.frameRate(12);
  };
  p.draw = () => {
    p.background("pink");
    p.noStroke();
    drawHelper.drawAll();
    moveAndDrawDust(windObjects, drawHelper);
    growTrees(trees);
  };
  p.windowResized = () => {
    const containerSize = document.getElementById("canvas-container").offsetWidth ;
   p.resizeCanvas(containerSize, p.height);
    
  }
};
new p5(homesketch);
