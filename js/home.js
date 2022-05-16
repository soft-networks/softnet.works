const homesketch = (p) => {
  const containerSize = document.getElementById("canvas-container").offsetWidth * 1.02;
  const canvassize = containerSize;
  // const canvassize = 512;
  // GRID_SIZE = Math.min(canvassize / cellsize, GRID_SIZE);
  GRID_SIZE = floor(canvassize / cellsize);
  console.log(GRID_SIZE);
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
  let xs ;
  let ys ;

  p.preload = () => {
    grass = p.loadImage("assets/IMG_1569.jpeg");
  };
  p.setup = () => {
    let cnv = p.createCanvas(p.windowWidth, p.windowHeight);
    cnv.id("bg-container")
    p.pixelDensity(1);
    
    p.frameRate(12);
    p.noStroke();
    drawPixels();
     xs = p.width / grass.width;
     ys = p.height / grass.height;
    p.noCursor();
  };
  function drawPixels() {
    grass.loadPixels();

    for (let x = 0; x < grass.width; x = x + ps) {
      for (let y = 0; y < grass.height; y = y + ps) {
        let index = (x  + grass.width * y) * 4;
        let r = grass.pixels[index];
        let g = grass.pixels[index + 1];
        let b = grass.pixels[index + 2];
        // let a = grass.pixels[index + 3];


        if (r > 125 && g > 125 & b > 125) {
          wos.push({ x: x, y: y, c: HIGHLIGHTCOLORS[0], g: g});
        }
      }
    }
    drawWind();
  }
  p.draw = () => {
    
  
    drawWind();
    
    p.fill("black");
    p.square(p.mouseX, p.mouseY, ps);

    
    if (t > 100) {
      t = t --;
    }
  }

  p.windowResized = () => {
    xs = p.width / grass.width;
    ys = p.height / grass.height;
    drawWind();
  }
  p.mouseDragged = () => {
    wos.push({x: p.mouseX / xs, y: p.mouseY / ys, g: 255});
  }
  function drawWind(){
    p.clear();
    let wind = rnd(-0.5,0.5);

    
    for (let i =0 ; i<wos.length; i++) {
      
      
      wos[i].x = wos[i].x + 1
      wos[i].y = wos[i].y + wind;

      if ( (wos[i].x * xs) > p.width) {
        wos[i].x = 0;
      }
      let wo = wos[i];
  
      if (wo.g > t) {
        p.fill(HIGHLIGHTCOLORS[0]);
        p.square(round(wo.x * xs), round(wo.y * ys), ps);
      }
    }
  }
};
new p5(backgroundsketch);