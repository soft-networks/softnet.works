const WAIT_TIME = 3000;

const logoSketch = (p) => {

  const canvassize = 512;
  const canvasaspect = 1;

  let grid = new Grid(GRID_SIZE, GRID_SIZE / canvasaspect);
  let drawHelper = new DrawGrid(p, grid, cellsize);
  let trees = [];
  let windObjects = [];
  let myFont;
  let xOf = 0.05;

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
  p.preload = () => {
    myFont = p.loadFont('assets/terminal-grotesque.ttf');
  }
  p.setup = () => {
    logoSetup();
    canvas = p.createCanvas(canvassize, canvassize);

    p.frameRate(12);

    p.noSmooth();

    p.textFont(myFont);
    p.textSize(20);

    
  };
  p.draw = () => {
    p.translate(-xOf * canvassize, 0);

    p.background("#fffef5");

    p.noStroke();
    drawHelper.drawAll();
    moveAndDrawDust(windObjects, drawHelper);

    if (p.millis() > WAIT_TIME)
      growTrees(trees);


    p.push();
    p.noStroke();
    p.fill("black");
    p.text("soft", p.width * 0.513, p.height * 0.55);
    p.text("networks", p.width * 0.513, p.height * 0.55 + 13);
    p.pop();

  };
};


setTimeout(() => new p5(logoSketch), 0);
