import { reactive } from 'vue';

export const useGameStore = () => {
    const state = reactive({
        grid: [],
        score: 0,
        bestScore: localStorage.getItem('bestScore') || 0,
    });

    const initializeGame = () => {
        state.grid = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        state.score = 0;
        addRandomTile();
        addRandomTile();
    };

    const addRandomTile = () => {
        const emptyCells = [];
        state.grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 0) {
                    emptyCells.push({ rowIndex, colIndex });
                }
            });
        });

        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const { rowIndex, colIndex } = emptyCells[randomIndex];
            state.grid[rowIndex][colIndex] = Math.random() < 0.9 ? 2 : 4;
        }
    };

    const combine = (array) => {
        let newArray = array.filter((num) => num !== 0);
        for (let i = 0; i < newArray.length - 1; i++) {
            if (newArray[i] === newArray[i + 1]) {
                newArray[i] *= 2;
                newArray[i + 1] = 0;
                state.score += newArray[i];
            }
        }
        newArray = newArray.filter((num) => num !== 0);
        while (newArray.length < 4) {
            newArray.push(0);
        }
        return newArray;
    };

    const moveUp = () => {
        let newGrid = state.grid.map((row) => combine(row));
        state.grid = newGrid;
    };

    const moveDown = () => {
        let newGrid = state.grid.map((row) => combine(row.reverse()).reverse());
        state.grid = newGrid;
    };

    const moveLeft = () => {
        let newGrid = state.grid[0].map((_, colIndex) => {
            let column = state.grid.map(row => row[colIndex]);
            return combine(column);
        });
        state.grid = newGrid[0].map((_, rowIndex) => newGrid.map(row => row[rowIndex]));
    };

    const moveRight = () => {
        let newGrid = state.grid[0].map((_, colIndex) => {
            let column = state.grid.map(row => row[colIndex]).reverse();
            return combine(column).reverse();
        });
        state.grid = newGrid[0].map((_, rowIndex) => newGrid.map(row => row[rowIndex]));
    };

    const canMove = (direction) => {
        let tempGrid = state.grid.map(row => row.slice());
        switch (direction) {
            case 'up':
                tempGrid = tempGrid.map(row => combine(row));
                break;
            case 'down':
                tempGrid = tempGrid.map(row => combine(row.reverse()).reverse());
                break;
            case 'left':
                tempGrid = tempGrid[0].map((_, colIndex) => {
                    let column = tempGrid.map(row => row[colIndex]);
                    return combine(column);
                });
                tempGrid = tempGrid[0].map((_, rowIndex) => tempGrid.map(row => row[rowIndex]));
                break;
            case 'right':
                tempGrid = tempGrid[0].map((_, colIndex) => {
                    let column = tempGrid.map(row => row[colIndex]).reverse();
                    return combine(column).reverse();
                });
                tempGrid = tempGrid[0].map((_, rowIndex) => tempGrid.map(row => row[rowIndex]));
                break;
        }

        return JSON.stringify(state.grid) !== JSON.stringify(tempGrid);
    };

    const move = (direction) => {
        if (!canMove(direction)) return;

        switch (direction) {
            case 'left':
                moveLeft();
                break;
            case 'right':
                moveRight();
                break;
            case 'up':
                moveUp();
                break;
            case 'down':
                moveDown();
                break;
        }

        addRandomTile();

        if (state.score > state.bestScore) {
            state.bestScore = state.score;
            localStorage.setItem('bestScore', state.bestScore);
        }
    };

    const handleKeydown = (event) => {
        switch (event.key) {
            case 'ArrowUp':
                move('up');
                break;
            case 'ArrowDown':
                move('down');
                break;
            case 'ArrowLeft':
                move('left');
                break;
            case 'ArrowRight':
                move('right');
                break;
        }
    };

    return {
        state,
        initializeGame,
        handleKeydown,
    };
};
