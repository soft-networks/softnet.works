const WAIT_TIME = 0;

var capturedust = false;
var capturer = new CCapture({ format: "png" , framerate: 12});

const logoSketch = (p) => {
  const canvassize = 1024;
  const canvasaspect = 1;

  let grid = new Grid(GRID_SIZE, GRID_SIZE / canvasaspect);
  let drawHelper = new DrawGrid(p, grid, 8);
  let trees = [];
  let windObjects = [];

  function logoSetup() {
    trees.push(
      new Tree(
        grid,
        ICON_PARAMS.initAngle,
        BRANCH_LENGTH,
        cv(grid.nCols * 0.5 - 2, grid.nRows * 0.5 + BRANCH_LENGTH * MAX_DEPTH),
        ICON_PARAMS.params
      )
    );
    for (let i = 0; i < 8; i++) {
      windObjects.push(cv(grid.nCols / rnd(1, 10), grid.nRows * 0.45 + rnd(-5, 5)));
    }
  }
  p.preload = () => {
    myFont = p.loadFont('assets/terminal-grotesque.ttf');
  }
  p.setup = () => {
    logoSetup();
    canvas = p.createCanvas(canvassize, canvassize);
    canvas.imageSmoothingEnabled = false;
    p.noSmooth();
    p.frameRate(12);
    p.textFont(myFont);
    p.textSize(36);
  };
  p.draw = () => {
    if (p.frameCount == 1) {
      capturer.start();
    }
    p.clear();
    p.noStroke();
    p.translate(-canvassize/2, -canvassize/2)
    if (!capturedust) {
      drawHelper.drawAll();
      growTrees(trees);
    } else {
      moveAndDrawDust(windObjects, drawHelper);
    }
    capturer.capture(document.getElementById("defaultCanvas0"));
  };
  p.keyPressed = () => {
    if (p.key == "g") {
      capturer.stop();
      capturer.save();
    }
    if (p.key == "s") {
      console.log("saving");
      //p.saveCanvas("logo" + Date.now(), "png");
    }
  };
};

new p5(logoSketch);