const WAIT_TIME = 0;

const logoSketch = (p) => {

  const canvassize = 512;
  const canvasaspect = 1;

  let grid = new Grid(GRID_SIZE, GRID_SIZE / canvasaspect);
  let drawHelper = new DrawGrid(p, grid, cellsize);
  let trees = [];
  let windObjects = [];

  function logoSetup() {
    trees.push(
      new Tree(
        grid,
        ICON_PARAMS.initAngle,
        BRANCH_LENGTH,
        cv(grid.nCols * 0.5 - 2, grid.nRows * 0.5 + (BRANCH_LENGTH * MAX_DEPTH)),
        ICON_PARAMS.params
      )
    );
    for (let i = 0; i < 5; i++) {
      windObjects.push(cv(grid.nCols / rnd(1, 10), grid.nRows * 0.45 + rnd(-5,5)));
    }
  }
  p.setup = () => {
    logoSetup();
    canvas = p.createCanvas(canvassize, canvassize);
    p.frameRate(12);
  };
  p.draw = () => {
    p.noStroke();
    drawHelper.drawNew();
    growTrees(trees);
  };
  p.keyPressed = () => {
    if (p.key == "s") {
      console.log("saving");
      p.saveCanvas("logo" + Date.now(), "png");
    }
  };
};


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
  p.keyPressed = () => {

    if (p.key == "s") {
      console.log("saving");
      p.saveCanvas("banner" + Date.now(), "png");
    }
  };
  p.mousePressed =  () => {
    let mp = cv(p.mouseX /cellsize, p.mouseY / cellsize);
    let gridPoint = grid.mapPosToGrid(mp);
    console.log("Adding tree", gridPoint.x);
    addNewTree(gridPoint.x , grid, trees);
  }
};

setTimeout(() => new p5(logoSketch), WAIT_TIME);
setTimeout(() => new p5(bannerSketch), WAIT_TIME);
