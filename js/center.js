const WAIT_TIME = 1000;

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
        LOGO_PARAMS.initAngle,
        BRANCH_LENGTH,
        cv(grid.nCols * 0.5 - 2, grid.nRows * 0.5 + (BRANCH_LENGTH * MAX_DEPTH)),
        LOGO_PARAMS.params
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

    p.noSmooth();

    p.textFont("Terminal Grotesque");
    p.textSize(20);

    p.push();
    p.noStroke();
    p.fill("black");
    p.text("soft", p.width * 0.51, p.height * 0.55);
    p.text("networks", p.width * 0.51, p.height * 0.55 + 13);
    p.pop();
    
  };
  p.draw = () => {
    p.noStroke();
    drawHelper.drawNew();
    moveAndDrawDust(windObjects, drawHelper);
    growTrees(trees);

  };
  p.keyPressed = () => {
    if (p.key == "s") {
      console.log("saving");
      p.saveCanvas("logo" + Date.now(), "png");
    }
  };
};


setTimeout(() => new p5(logoSketch), WAIT_TIME);
