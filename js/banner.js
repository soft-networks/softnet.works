const WAIT_TIME = 0;

const bannerSketch = (p) => {
  const canvassize = 512;
  const canvasaspect = 2;

  let grid = new Grid(GRID_SIZE, GRID_SIZE / canvasaspect);
  let drawHelper = new DrawGrid(p, grid, 2);

  let trees = [];
  let windObjects = [];
  let xstart = 0.1; let xend = 0.8;

  function bannerSetup() {
    trees.push(
      new Tree(grid, LOGO_PARAMS.initAngle, BRANCH_LENGTH, cv(grid.nCols * xstart, grid.nRows ), LOGO_PARAMS.params)
    );
    addNewTree(xend * grid.nCols, grid, trees);
    // setTimeout(forest, rnd(3000, 8000));
    for (let i = 0; i < 5; i++) {
      windObjects.push(cv(grid.nCols / rnd(1, 10), grid.nRows - (BRANCH_LENGTH * MAX_DEPTH * 1.5) + rnd(-5,5)));
    }
    growForest(grid, trees);
  }
  p.setup = () => {
    bannerSetup();
    canvas = p.createCanvas(canvassize, canvassize);
    canvas.imageSmoothingEnabled = false;
    p.noSmooth();
    p.frameRate(12);
  };
  p.draw = () => {
    p.noStroke();
    drawHelper.drawNew(p, grid);
    moveAndDrawDust(windObjects, drawHelper);
    growTrees(trees);
  };
};


setTimeout(() => new p5(bannerSketch), WAIT_TIME);