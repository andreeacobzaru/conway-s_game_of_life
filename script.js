//Gabrielle & Andreea, Programming 9y
//QUESTIONS:
//What happens when the cells reach the edge of the grid?
//How would you delay the generation by 0.5s?
//Obtrusive vs. Unobtrusive JS?

//Global variables
let rows;       //the user's number of rows in the grid
let cols;       //the user's number of columns in the grid
let numGen;     //the number of generations inputed by the user
let grid;       //the grid array
let newGrid;    //the next generation grid array
let cell;       //the individual <td> within the <table>
let shellGrid;    //the empty grid array
let generationNum = 0;    //current generation it is on
let intervalId; 
//let playing = false; 

//Tests user inputs to ensure each is a valid natural number (>= 1). If an input is invalid, the input field is emptied.
function validityCheck(id) {
  if (document.getElementById(id).checkValidity() != true) {
      document.getElementById(id).value = '';
  }
}

//Initializes grid dimensions and the number of generations as the user's inputs and newGrid array as an empty array with array elements of value 0. Calls makeGrid().
function handleSubmit(){
  numGen = Number(document.getElementById('numGen').value);
  rows = Number(document.getElementById('rows').value);
  cols = Number(document.getElementById('cols').value);
  newGrid = makeShellGrid();
  makeGrid();
}

//Creates a grid array (each array element has a value of 0) and displays an empty table with dead cells. Calls hideInputs().
function makeGrid() {
  let fullContainer = document.getElementById('fullContainer');
  let gridContainer = document.createElement('table');
  gridContainer.id = 'table';
  let rowContainer;

  grid = [];
  for (let i = 0; i < rows; i++) {
    rowContainer = document.createElement('tr');
    grid.push([]);
    for (let j = 0; j < cols; j++) {
      grid[i].push(0);
      cell = document.createElement('td');
      cell.setAttribute('id', i + '_' + j);
      cell.setAttribute('class', 'dead');
      cell.setAttribute('value', 0);
      cell.setAttribute('rowPos', i);
      cell.setAttribute('colPos', j);
      cell.setAttribute('onclick', 'changeCell(this)');
      rowContainer.appendChild(cell);
    }
    gridContainer.appendChild(rowContainer);
  }
  fullContainer.appendChild(gridContainer);

  hideInputs();
  revealControlButtons();
}

//Returns a mulidimesional array with each array element of value 0.
function makeShellGrid() {
  shellGrid = [];
  for (let i = 0; i < rows; i++) {
    shellGrid.push([]);
    for (let j = 0; j < cols; j++) {
      shellGrid[i].push(0);
    }
  }
  return shellGrid;
}

//Hides the input fields for grid dimensions.
function hideInputs() {
  document.getElementById('inputs').style.display = 'none';
}

//Reveal control buttons on the HTML page.
function revealControlButtons() {
  document.getElementById('gameControls').style.display = 'block';
}

//Changes the value and colour of individual cells dependant on each cell's class name (dead or alive).
function changeCell(cell) {  
  if (cell.className == 'dead') {
    cell.className = cell.className.replace('dead', 'alive');
    cell.setAttribute('value', 1);
    rowPos = cell.getAttribute('rowPos');
    colPos = cell.getAttribute('colPos');
    grid[rowPos][colPos] = 1;
  } else if (cell.className == 'alive') {
    cell.className = cell.className.replace('alive', 'dead');
    cell.setAttribute('value', 0);
    rowPos = cell.getAttribute('rowPos');
    colPos = cell.getAttribute('colPos');
    grid[rowPos][colPos] = 0;
  }
  console.log(grid);
} 

//Runs the applyRules() function on each iteration through the cells of the grid. Updates the grid display at the end.
function playGameOfLife() {
  generationNum++;
  document.getElementById('generation').innerHTML = generationNum;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      applyRules(i, j);
    }
  }
  updateGrid();
}

//Determines the status of each cell in the next generation based on its neighbours.
/*Rules of Conway's Game of Life 
Underpopulation - Any live cell with fewer than two neigbours dies
Just Right - Any live cell with 2 or 3 neighbours will live on to the next generation
Overpopulation - Any live cell with more than three live neighbours will die
Breeding - Any dead cell with exactly 3 neighbours will come to life*/
function applyRules(cellRow, cellCol) {
  let totalNeighbours = testNeighbours(cellRow, cellCol);
  
  if (grid[cellRow][cellCol] == 0) {
    if (totalNeighbours == 3) {
      newGrid[cellRow][cellCol] = 1;
    }
  } else if (grid[cellRow][cellCol] == 1) {
    if (totalNeighbours < 2) {
      newGrid[cellRow][cellCol] = 0;
    } else if (totalNeighbours > 3) {
      newGrid[cellRow][cellCol] = 0;
    } else if (totalNeighbours == 2 || totalNeighbours == 3) {
      newGrid[cellRow][cellCol] = 1;
    }
  }
}

//Counts the total number of alive cells around the each cell and returns the number at the end (to be used in applyRules()).
function testNeighbours(cellRow, cellCol) {
  let count = 0;

  if (cellRow - 1 >= 0) {
    if (grid[cellRow - 1][cellCol] == 1) {count++;}
  }
  if (cellRow - 1 >= 0 && cellCol - 1 >= 0) {
    if (grid[cellRow - 1][cellCol - 1] == 1) {count++;}
  }
  if (cellRow - 1 >= 0 && cellCol + 1 < cols) {
    if (grid[cellRow - 1][cellCol + 1] == 1) {count++;}
  }
  if (cellCol - 1 >= 0) {
    if (grid[cellRow][cellCol - 1] == 1) {count++};
  }
  if (cellCol + 1 < cols) {
    if (grid[cellRow][cellCol + 1] == 1) {count++;}
  }
  if (cellRow + 1 < rows) {
    if (grid[cellRow + 1][cellCol] == 1) {count++;}
  }
  if (cellRow + 1 < rows && cellCol - 1 >= 0) {
    if (grid[cellRow + 1][cellCol - 1] == 1) {count++;}
  }
  if (cellRow + 1 < rows && cellCol + 1 < cols) {
    if (grid[cellRow + 1][cellCol + 1] == 1) {count++;}
  }
  return count;
}

//Iterates through each cell in the grid and updates its colour and attribute value based on the value of its array element. 
function printGrid(gridIn) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let currentCell = document.getElementById(i + '_' + j);
      if (gridIn[i][j] == 0) {
        currentCell.className = cell.className.replace('alive', 'dead');
        currentCell.setAttribute('value', 0);
      } else {
        currentCell.className = cell.className.replace('dead', 'alive');
        currentCell.setAttribute('value', 1);
      }
    }
  }
}

//Stores the values of the grid array in the newGrid array for reference in the next generation. Calls the printGrid() function to update the display for the next generation.
function updateGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = newGrid[i][j];
    }
  }
  printGrid(grid);

  console.log('newGrid: ');
  console.log(newGrid);
  console.log('grid: ');
  console.log(grid);
}

//Reverts the grid array to an empty grid via the makeShellGrid() function. Then, the printGrid() function displays the dead grid.
function clearGrid() {
  generationNum = 0;
  document.getElementById('generation').innerHTML = generationNum;
  
  newGrid = makeShellGrid();
  grid = makeShellGrid();
  printGrid(newGrid);
  console.log(newGrid);
}

//Calls clearGrid() to revert the grid to an empty, dead grid. Removes the table element (grid) from the HTML. Restores the values of the hidden dimension inputs to 0 and then reveals the input fields and submit button once again.
function resetGrid() {
  clearGrid();
  
  let gridContainer = document.getElementById('table')
  gridContainer.remove();

  document.getElementById('cols').value = '';
  document.getElementById('rows').value = '';
  document.getElementById('numGen').value = '';
  document.getElementById('inputs').style.display = 'block';

  hideControlButtons();
}

//Hide control buttons on the HTML page.
function hideControlButtons() {
  document.getElementById('gameControls').style.display = 'none';
}

//Run the playGameOfLife() function for as many generations as specified by the user.
function executeUserGen() {
  intervalId = setInterval(playContinuous, 500);

}

function playContinuous () {
  if (generationNum < numGen) {
    playGameOfLife();
  } else {
    clearInterval(intervalId);
  }
}


let rowInput = document.getElementById('rows');
let colInput = document.getElementById('cols');
let submitButton = document.getElementById('submit');
let startButton = document.getElementById('start');
let nextGenButton = document.getElementById('nextGen');
let clearButton = document.getElementById('clear');
let resetButton = document.getElementById('reset');

rowInput.addEventListener('input', () => {
  validityCheck('rows');
});
colInput.addEventListener('input', () => {
  validityCheck('cols');
});
submitButton.addEventListener('click', () => {
  handleSubmit();
});
startButton.addEventListener('click', () => {
  executeUserGen();
})
nextGenButton.addEventListener('click', () => {
  playGameOfLife();
});
clearButton.addEventListener('click', () => {
  clearGrid();
});
resetButton.addEventListener('click', () => {
  resetGrid();
});