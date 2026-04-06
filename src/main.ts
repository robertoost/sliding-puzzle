import { Component, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { PuzzleBoard } from './app/puzzle-board/puzzle-board';

@Component({
  selector: 'app-root',
  imports: [PuzzleBoard],
  template: `
  <app-puzzle-board></app-puzzle-board>
`,
})
export class App {
  name = 'Angular';
  counter = signal(0);
}

bootstrapApplication(App);
