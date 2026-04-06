import { Component, input, output } from '@angular/core';
import { TileData } from '../puzzle-service';

@Component({
  selector: 'app-tile',
  imports: [],
  templateUrl: './tile.html',
  styleUrl: './tile.css',
})
export class Tile {
  tile = input.required<TileData>();
  isMovable = input.required<boolean>();
  imagePath = input.required<string>();
  clicked = output<number>();

  onTileClick(): void {
    if (this.isMovable()) {
      this.clicked.emit(this.tile().currentPosition);
    }
  }

  getBackgroundPosition(): string {
    const value = this.tile().value - 1;
    const row = Math.floor(value / 4);
    const col = value % 4;
    const percentX = (col * 100) / 3;
    const percentY = (row * 100) / 3;
    return `${percentX}% ${percentY}%`;
  }

  getBackgroundImage(): string {
    return `url("${this.imagePath()}")`;
  }
}
