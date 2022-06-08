const homesketch = (p) => {
  const containerSize = document.getElementById("canvas-container").offsetWidth * 1.02;
  const canvassize = containerSize;
  // const canvassize = 512;
  // GRID_SIZE = Math.min(canvassize / cellsize, GRID_SIZE);
  GRID_SIZE = floor(canvassize / cellsize);
  console.log(GRID_SIZE);
  const canvasaspect = 3.6;

  let TREE_HEIGHT =  round(BRANCH_LENGTH * MAX_DEPTH * 3.6);

  let grid = new Grid(GRID_SIZE, TREE_HEIGHT);
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
    canvas = p.createCanvas(canvassize, TREE_HEIGHT * cellsize);
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
    const containerSize = document.getElementById("canvas-container").offsetWidth;
    p.resizeCanvas(containerSize, p.height);
  };
};
new p5(homesketch);

const backgroundsketch = (p) => {
  let grass;
  let ps = 2;

  let wos = [];
  let t = 253;
  let gs = 512;
  let xs ;
  let ys ;
  let container = document.getElementById("main-container");


  let mp = {x: 0, y:0};
  p.setup = () => {
    let cnv = p.createCanvas(container.offsetWidth, container.offsetHeight);
    cnv.id("bg-container")
    p.pixelDensity(1);
    
    p.frameRate(12);
    p.noStroke();
    drawPixels();
    xs = p.width / gs;
    ys = p.height / gs;
  };
  function drawPixels() {
    for (let i =0 ; i < 100; i++) {
      wos.push({x: rnd(0, gs), y: rnd(0, gs), c: HIGHLIGHTCOLORS[0], g: 255});
    }
    drawWind();
  }
  p.draw = () => {
    
    drawWind();
    
    if (p.mouseIsPressed) {
      wos.push({x: p.mouseX / xs, y: p.mouseY / ys, g: 255});
    }
    
    
    if (t > 100) {
      t = t --;
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(container.offsetWidth, container.offsetHeight)
    xs = p.width / gs;
    ys = p.height / gs;
    drawWind();
  }
  function drawWind(){
    p.clear();
    let wind = rnd(-0.9,0.9);

    mp.x = mp.x + 1
    mp.y = mp.y + wind;
    
    for (let i =0 ; i<wos.length; i++) {
      
      
      wos[i].x = wos[i].x + 1
      wos[i].y = wos[i].y + wind;

      if ( (wos[i].x * xs) > p.width) {
        wos[i].x = 0;
      }
      let wo = wos[i];
  
      if (wo.g > t) {
        p.fill(120, 190, 165);
        // p.square(round(wo.x * xs),  round(wo.y * ys), ps);
        p.square(round(wo.x * xs),  round(wo.y * ys), ps);
      }
    }
  }
};
new p5(backgroundsketch);


const enterEmail = (el) => {
  el.placeholder = "enter your email";
}

const resetPlaceholder = (el) => {
  el.placeholder = "sign up for mailing list";
}