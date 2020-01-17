class Game {
  init = (rows, cols) => {
    this.rows = rows;
    this.cols = cols;
    this.world = document.querySelector('#world');
    this.infos = document.querySelector('#infos');
    this.generation = 0;

    this.generatePopulation();
    var interval = setInterval(() => {
        this.live();
        // clearInterval(interval);
    }, 100);
  }

  generatePopulation = () => {
    this.population = [];
    for(let i = 0; i < this.rows; i++) {
      const row = this.createRow();
      for(let j = 0; j < this.cols; j++) {
        const cell = this.createCell(row);
        this.population.push({
          col: j,
          row: i,
          alive: Math.random() > 0.5 ? true : false,
          element: cell
        });
      }
    }

    this.render();
  }

  createRow = () => {
    const ul = document.createElement('ul');
    this.world.appendChild(ul);
    return ul;
  }
  createCell = row => {
    const li = document.createElement('li');
    row.appendChild(li);
    return li;
  }

  getRandomColor = () => {
    const color = Math.floor(Math.random() * 360);

    return `hsl(${color}, 100%, 50%)`;
  }

  render = () => {
    this.population.forEach(cell => {
      if(cell.alive) {
        cell.element.classList.add('alive');
        // cell.element.style.background = this.getRandomColor();
      } else {
        cell.element.classList.remove('alive');
        // cell.element.style.background = null;
      }
    });
    this.infos.innerHTML = `Geração: ${this.generation}`;
    this.generation ++;
  }

  live = () => {
    const populationCopy = [...this.population];
    this.population.forEach((cell, index) => {
      const neighboors = this.getNeighboors(cell);
      let aliveNeighboors = 0
      neighboors.forEach(neighboor => {
        if(neighboor.alive) {
          aliveNeighboors++;
        }
      });

      if(cell.alive && (aliveNeighboors < 2 || aliveNeighboors > 3)) {
        populationCopy[index].alive = false;
      }
      if(!cell.status && aliveNeighboors == 3) {
        populationCopy[index].alive = true;
      }
    });
    
    this.population = [...populationCopy];
    this.render();
  }

  getNeighboors = (cell) => {
    const top = cell.row - 1 > 0 ? cell.row - 1 : undefined;
    const bottom = cell.row + 1 <= this.rows ? cell.row + 1 : undefined;
    const left = cell.col - 1 > 0 ? cell.col - 1 : undefined;
    const right = cell.col + 1 <= this.cols ? cell.col + 1 : undefined;

    const north = this.population[(top) * this.cols + (cell.col)];
    const south = this.population[(bottom) * this.cols + (cell.col)];
    const west = this.population[(cell.row) * this.cols + (left)];
    const east = this.population[(cell.row) * this.cols + (right)];
    const northeast = this.population[(top) * this.cols + (right)];
    const southeast = this.population[(bottom) * this.cols + (right)];
    const southwest = this.population[(bottom) * this.cols + (left)];
    const northwest = this.population[(top) * this.cols + (left)];

    const neighboors = [north, south, west, east, northeast, southeast, southwest, northwest].filter(el => typeof el != 'undefined');
    return neighboors;
  }
}

// li.innerHTML = aRow * cols + aCol;