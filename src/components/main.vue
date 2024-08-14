<template>
  <div class="container" @keydown="handleKeydown" tabindex="0">
    <div class="head">
      <div class="name">
        <div>2048</div>
      </div>
      <div class="interface">
        <div class="score">
          <div class="points">
            <div>счет</div>
            <div>{{ state.score }}</div>
          </div>
          <div class="record">
            <div>лучший</div>
            <div>{{ state.bestScore }}</div>
          </div>
        </div>
        <div class="new-game">
          <button class="btnNewGame" @click="newGame">Новая игра</button>
        </div>
      </div>
    </div>
    <div id="game-container">
      <div id="grid-container">
        <div class="grid-row" v-for="(row, rowIndex) in state.grid" :key="rowIndex">
          <div
              class="grid-cell"
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              :style="{ backgroundColor: getCellColor(cell) }"
          >
            {{ cell !== 0 ? cell : '' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useGameStore } from '../stores/script.js';

export default {
  setup() {
    const { state, initializeGame, handleKeydown } = useGameStore();


    const newGame = () => {
      initializeGame();
    };

    const getCellColor = (value) => {
      const colors = {
        0: 'rgba(238, 228, 218, 0.5)',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e',
      };
      return colors[value] || '#3c3a32';
    };

    initializeGame();

    return {
      state,
      newGame,
      getCellColor,
      handleKeydown,
    };
  },
};
</script>

<style src="../assets/style.css"></style>
