
const DIRS = ['N', 'E', 'S', 'W'];
//const NEXTDIRS = ['N', 'E', 'S', 'W', 'END'];
const ADJ = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

//Can be made Grid attibutes
const endFreq = 0.05;
const turnFreq = 0.3;
const contFreq = 0.65;
const splitFreq = 0.0;

class Grid {
    constructor(size, rotation) {
        this.size = size;
        this.grid = new Array(size).fill().map(() => Array(size).fill(false));
        this.rotation = rotation; //Radians
        this.emptyLocations = new Set();
        for(let i = 0; i < size*size; i++) {
            this.emptyLocations.add(i);
        }
    }

    fillGrid() {
        if(this.emptyLocations.size > 0) {
            let nextloc;
            let empties = this.emptyLocations.values();
            let randInd = Math.floor(Math.random()*this.emptyLocations.size);
            for(let i = 0; i < randInd+1; i++) {
                nextloc = empties.next().value;
            }
            nextloc = [Math.floor(nextloc/this.size), nextloc%this.size]
            this.drawSegment(nextloc, DIRS[Math.floor(Math.random()*DIRS.length)], false);
            this.fillGrid();
        }
    }

    drawSegment(loc, dir, nextIsCorner) {
        this.setBlock(loc);
        this.drawGrid();
        //Check next space, end if invalid
        var nextLoc = this.getAdj(loc, dir);
        try {
            var nextSpace = this.blockAt(nextLoc);
            if(nextSpace || nextLoc[0] > this.size - 1 || nextLoc[1] > this.size - 1) {
                return;
            }
        } catch (error) {
            return;
        }

        //End segment with probability endFreq
        if(Math.random() < endFreq) {
            return;
        }

        var adjTrue = 0;
        for(let y in ADJ) {
            try {
                if(this.blockAt(this.getAdj(nextLoc, ADJ[y]))) {
                    adjTrue += 1;
                }
            } catch (error) {
                continue;
            }
        }
        if(adjTrue > 2 || (adjTrue > 1 && !nextIsCorner)) {
            return;
        }

        var remainDirs = new Set(DIRS);
        for(let x in DIRS) {
            try {
                var nextNextLoc = this.getAdj(nextLoc, DIRS[x]);
                if(this.blockAt(nextNextLoc)) {
                    remainDirs.delete(DIRS[x]);
                } else {
                    adjTrue = 0;
                    for(let y in ADJ) {
                        try {
                            if(this.blockAt(this.getAdj(nextNextLoc, ADJ[y]))) {
                                adjTrue += 1;
                            }
                        } catch (error) {
                            continue;
                        }
                    }
                    if(adjTrue > 1) {
                        remainDirs.delete(DIRS[x]);
                        break;
                    }
                    
                }
            } catch (error) {
                remainDirs.delete(DIRS[x]);
            }
        }
        if(remainDirs.size == 0) {
            return;
        }
        var nextDirArr = Array.from(remainDirs);
        var nextDir = nextDirArr[Math.floor(Math.random()*nextDirArr.length)];
        this.drawSegment(this.getAdj(loc, dir), nextDir, nextDir != dir ? true : false);
    }

    blockAt(loc) {
        return this.grid[loc[0]][loc[1]];
    }

    setBlock(loc) {
        try {
            this.grid[loc[0]][loc[1]] = true;
        } catch (error) {
            throw new Error(error);
        }
        for(let pad in ADJ) {
            let adjLoc = this.getAdj(loc, ADJ[pad]);
            if(adjLoc[0] < 0 || adjLoc[0] > this.size-1 || adjLoc[1] < 0 || adjLoc[1] > this.size-1) {
                continue;
            }
            this.emptyLocations.delete(adjLoc[0]*this.size+adjLoc[1]);
        }
        this.emptyLocations.delete(loc[0]*this.size+loc[1]);
    }

    getAdj(loc, dir) {
        switch(dir) {
            case 'N':
                return [loc[0]-1, loc[1]];
            case 'NE':
                return [loc[0]-1, loc[1]+1];
            case 'E':
                return [loc[0], loc[1]+1];
            case 'SE':
                return [loc[0]+1, loc[1]+1];
            case 'S':
                return [loc[0]+1, loc[1]];
            case 'SW':
                return [loc[0]+1, loc[1]-1];
            case 'W':
                return [loc[0], loc[1]-1];
            case 'NW':
                return [loc[0]-1, loc[1]-1];
        }
    }

    drawGrid() {
        var line = "";
        for(let row = 0; row < this.size; row++) {
            for(let col = 0; col < this.size; col++) {
                if(!this.blockAt([row, col])) {
                    line += '_';
                } else {
                    line += 'X';
                }
            }
            line += '\n';
        }
        console.log(line);
        
    }
}

let newGrid;
let gridCanvas;
let canvasL = 500;
let canvasH = 500;
let gridSize = 500;

function setupMayan() {
    newGrid = new Grid(20, null);
    newGrid.fillGrid();
    gridCanvas = createCanvas(canvasL, canvasH);
    noLoop();
}


function drawMayan() {
    noStroke();
    background(0);
    var blockSize = gridSize/newGrid.size;
    for(let r = 0; r < newGrid.size; r++) {
        for(let c = 0; c < newGrid.size; c++) {
            if(newGrid.blockAt([r, c])) {
                fill('red');
                rect(r*blockSize, c*blockSize, blockSize, blockSize);
            }
        }
    }
}