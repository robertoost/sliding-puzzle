import { Injectable, signal } from '@angular/core';

export interface TileData {
  value: number;
  correctPosition: number;
  currentPosition: number;
}

@Injectable({
  providedIn: 'root',
})
export class PuzzleService {
  private readonly GRID_SIZE = 4;
  private readonly TOTAL_TILES = this.GRID_SIZE * this.GRID_SIZE;

  tiles = signal<TileData[]>([]);
  emptyPosition = signal<number>(15);
  moveCount = signal<number>(0);
  isComplete = signal<boolean>(false);

  initializePuzzle(): void {
    const tiles: TileData[] = [];
    const positions = this.generateRandomSolvablePositions();

    for (let i = 0; i < this.TOTAL_TILES - 1; i++) {
      tiles.push({
        value: i + 1,
        correctPosition: i,
        currentPosition: positions[i]
      });
    }

    // Sort our tile list so they are rendered in the randomized order we created.
    tiles.sort((a, b) => a.currentPosition - b.currentPosition);

    this.tiles.set(tiles);
    this.emptyPosition.set(15);
    this.moveCount.set(0);
    this.isComplete.set(false);
  }

  private generateRandomSolvablePositions(): number[] {
    let positions: number[];
    let isSolvable = false;

    // Keep randomly generating until we get a solvable puzzle.
    while (!isSolvable) {
      positions = Array.from({ length: this.TOTAL_TILES - 1 }, (_, i) => i);

      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      // Check if the puzzle is solvable, and after that whether the 0.000000000153% chance of the puzzle randomly already being solved hasn't happened.
      isSolvable = this.isSolvable(positions) && !positions.every((pos, index) => pos === index)
    }

    return positions!;
  }

  private isSolvable(positions: number[]): boolean {
    // 50% of all sliding puzzle formations are unsolvable.
    // For each tile, the number of following tiles that are lower than itself is known as its inversions.
    // For solvability, we want to determine whether the total number of inversions across all tiles is even.
    let inversions = 0;

    for (let i = 0; i < positions.length - 1; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (positions[i] > positions[j]) {
          inversions++;
        }
      }
    }

    return inversions % 2 === 0;
  }

  canMoveTile(position: number): boolean {

    // Determine where the current/empty row and collumn indices are.
    const emptyPos = this.emptyPosition();
    const row = Math.floor(position / this.GRID_SIZE);
    const col = position % this.GRID_SIZE;
    const emptyRow = Math.floor(emptyPos / this.GRID_SIZE);
    const emptyCol = emptyPos % this.GRID_SIZE;

    // Check whether the selected position is in the same row/column as the empty position and only one row/col away.
    const isSameRow = row === emptyRow && Math.abs(col - emptyCol) === 1;
    const isSameCol = col === emptyCol && Math.abs(row - emptyRow) === 1;

    // true if position is directly above/below/beside the empty position.
    return isSameRow || isSameCol;
  }

  moveTile(position: number): boolean {
    if (!this.canMoveTile(position)) {
      return false;
    }

    const tiles = this.tiles();
    const emptyPos = this.emptyPosition();
    // Get the actual index in the tile array of the tile with the given position.
    const tileIndex = tiles.findIndex(t => t.currentPosition === position);

    // When every tile is updated correctly, this should not happen anymore.
    if (tileIndex === -1) {
      return false;
    }

    // Update the tile we want to move to the former empty position.
    const newTiles = [...tiles];
    newTiles[tileIndex] = {
      ...newTiles[tileIndex],
      currentPosition: emptyPos
    };

    // Sort the tiles for rendering purposes.
    newTiles.sort((a, b) => a.currentPosition - b.currentPosition);

    // Set the new tiles and update the empty position to where our selected tile was.
    this.tiles.set(newTiles);
    this.emptyPosition.set(position);
    this.moveCount.update(count => count + 1);

    this.checkCompletion();

    return true;
  }

  private checkCompletion(): void {
    const tiles = this.tiles()
    const isComplete = tiles.every(tile => tile.currentPosition === tile.correctPosition);
    this.isComplete.set(isComplete);
  }


  resetPuzzle(): void {
    this.initializePuzzle();
  }
}
