const PEICES = ['STEND', 'SPLIT', 'CORNER', 'TUBE', 'EMPTY', 'LONE'];
const NEXTPEICES = ['STEND', 'CORNER', 'TUBE'];

const DIRS = ['N', 'E', 'S', 'W'];
const ADJ = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

//Can be made Grid attibutes
const stendFreq = 0.1;
const cornerFreq = 0.3;
const tubeFreq = 0.6;

class Grid {
    constructor(size, rotation) {
        this.size = size;
        this.grid = new Array(size).fill().map(() => Array(size).fill(null));
        this.rotation = rotation; //Radians
        this.emptyLocations = new Set();
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                this.emptyLocations.add([i, j]);
            }
        }
    }

    fillGrid() {
        if(this.emptyLocations.size > 0) {
            let nextloc;
            let empties = this.emptyLocations.keys();
            for(let i = 0; i < Math.floor(Math.random()*this.emptyLocations.size); i++) {
                nextloc = empties.next().value;
            }
            nextloc = [0, 0];
            this.drawSegment(nextloc, 'STEND', DIRS[Math.floor(Math.random()*DIRS.length)]);
            this.fillGrid();
        }
    }

    /** Recursively draws a block in the grid. Eqivelant to taking random length walks on a grid.
     *  1. Draw block and fill adj spaces with empty
     *  2. Choose next block 
     */
    drawSegment(loc, type, dir) {
        this.setBlock(loc, type);
        //Check next space, end if invalid
        try {
            var nextSpace = this.blockAt(this.getAdj(loc, dir));
            if(nextSpace != null) {
                return this.endSegment(loc);
            }
        } catch (error) {
            return this.endSegment(loc);
        }

        for(let pad in ADJ) {
            if(ADJ[pad] == dir) {
                continue;
            } else {
                let adjLoc = this.getAdj(loc, ADJ[pad]);
                if(adjLoc[0] < 0 || adjLoc[1] < 0) {
                    continue;
                } else if(this.blockAt(adjLoc) != null) {
                    continue;
                } else {
                    this.setBlock(adjLoc, 'EMPTY');
                }
            }
        }
        //Calc nextPeice
        var nextPeice;
        var nextRand = Math.random();
        if(nextRand < stendFreq) {
            nextPeice = 'STEND';
        } else if(nextRand < stendFreq+cornerFreq) {
            nextPeice = 'CORNER';
        } else {
            nextPeice = 'TUBE';
        }


        switch(nextPeice) {
            case "STEND":
                return this.endSegment(this.getAdj(loc, dir));
            case 'CORNER':
                var nextDir;
                if(dir == 'N' || dir == 'S') {
                    nextDir = Math.random() < 0.5 ? 'N' : 'S';
                } else {
                    nextDir = Math.random() < 0.5 ? 'W' : 'E';
                }
                return this.drawSegment(this.getAdj(loc, dir), nextPeice, nextDir);
            case 'TUBE':
                return this.drawSegment(this.getAdj(loc, dir), nextPeice, dir);
        }   
    }

    blockAt(loc) {
        return this.grid[loc[0]][loc[1]];
    }

    setBlock(loc, block) {
        let row = loc[0];
        let col = loc[1];
        this.grid[loc[0]][loc[1]] = block;
        this.emptyLocations.delete(loc);
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

    endSegment(loc, isLone) {
        this.setBlock(loc,'STEND');
        for(var dir in ADJ) {
            try {
                var space = this.blockAt(this.getAdj(loc, dir));
                if(space == null) {
                    this.setBlock(this.getAdj(loc, dir), 'EMPTY');
                } else if (space != 'EMPTY') {
                    throw new Error('Invalid block placement');
                }
            } catch (error) {
                continue;
            }
        }
    }
}

let newGrid = new Grid(20, null);
console.log(newGrid);
newGrid.fillGrid();
console.log(newGrid);