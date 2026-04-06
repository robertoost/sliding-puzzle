import { Component, OnInit, computed } from '@angular/core';
import { Tile } from '../tile/tile';
import { PuzzleService } from '../puzzle-service';

const MCMAIN_LOGO = "assets/McMain_Software_Logo.png";
const EASTER_EGG = "assets/this_is_fine.jpeg";

@Component({
  selector: 'app-puzzle-board',
  imports: [Tile],
  templateUrl: './puzzle-board.html',
  styleUrl: './puzzle-board.css',
})
export class PuzzleBoard implements OnInit {
  tiles = this.puzzleService.tiles;
  emptyPosition = this.puzzleService.emptyPosition;
  moveCount = this.puzzleService.moveCount;
  isComplete = this.puzzleService.isComplete;
  titleClicks = 0;
  imagePath = MCMAIN_LOGO;

  boardPositions = computed(() => {
    const positions = new Array(16).fill(null);
    this.tiles().forEach((tile) => {
      positions[tile.currentPosition] = tile;
    });
    return positions;
  });

  constructor(private puzzleService: PuzzleService) {}

  ngOnInit(): void {
    this.puzzleService.initializePuzzle();
  }

  canMoveTile(position: number): boolean {
    return this.puzzleService.canMoveTile(position);
  }

  onTileClick(position: number): void {
    this.puzzleService.moveTile(position);
  }

  resetPuzzle(): void {
    this.puzzleService.resetPuzzle();
    this.titleClicks = 0;
    this.imagePath = MCMAIN_LOGO
  }

  titleClick(): void {
    this.titleClicks++;
    if (this.titleClicks === 10) {
      this.imagePath = EASTER_EGG;
    }
  }
}
