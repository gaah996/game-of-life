class Game {
  init = () => {
    this.world = document.querySelector('#world');
    this.generation = 0;
    this.previousPopulation = [];
    this.generatePopulation(2, 2);
    var interval = setInterval(() => {
      const pps = this.previousPopulation.map(el => el.status);
      const ps = this.population.map(el => el.status);
      if(pps != ps) {
        this.live();
      } else {
        clearInterval(interval);
      }
    }, 100);
  }

  generatePopulation = (cols, rows) => {
    this.population = [];
    for(let i = 0; i < rows; i++) {
      for(let j = 0; j < cols; j++) {
        this.population.push({
          id: i * cols + j,
          row: i,
          col: j,
          status: Math.random() > 0.5 ? true : false
        });
      }
    }

    this.generateGrid(cols, rows);
    this.render();
  }
  
  generateGrid = (cols, rows) => {
    for(let i = 0; i < rows; i++) {
      const ul = document.createElement('ul');
      this.world.appendChild(ul);
      for(let j = 0; j < cols; j++) {
        const li = document.createElement('li');
        li.classList.add('cell');
        // li.innerHTML = i * cols + j;
        ul.appendChild(li);

        this.population[i * cols + j].element = li;
      }
    }
  }

  render = () => {
    this.population.forEach(cell => {
      if(cell.status) {
        cell.element.classList.add('alive');
      } else {
        cell.element.classList.remove('alive');
      }
    });
    document.querySelector('#infos').innerHTML = "Geração: " + this.generation;
    this.generation ++;
  }

  live = () => {
    const populationCopy = [...this.population];
    this.population.forEach((cell, index) => {
      const neighboors = this.getNeighboors(cell);
      let aliveNeighboors = 0
      neighboors.forEach(neighboor => {
        if(neighboor.status) {
          aliveNeighboors++;
        }
      });

      if(cell.status && (aliveNeighboors < 2 || aliveNeighboors > 3)) {
        populationCopy[index].status = false;
      }
      if(!cell.status && aliveNeighboors == 3) {
        populationCopy[index].status = true;
      }
    });
    this.previousPopulation = [...this.population];
    this.population = [...populationCopy];
    this.render();
  }

  getNeighboors = (person) => {
    const neighboors = this.population.filter(cell => {
      const north = cell.row == person.row - 1 && cell.col == person.col;
      const south = cell.row == person.row + 1 && cell.col == person.col;
      const west = cell.row == person.row && cell.col == person.col - 1;
      const east = cell.row == person.row && cell.col == person.col + 1;
      const northeast = cell.row == person.row - 1 && cell.col == person.col + 1; 
      const southeast = cell.row == person.row + 1 && cell.col == person.col + 1; 
      const southwest = cell.row == person.row + 1 && cell.col == person.col - 1; 
      const northwest = cell.row == person.row - 1 && cell.col == person.col - 1;

      return north || south || west || east || northeast || southeast || southwest || northwest;
    });

    return neighboors;
  }
}