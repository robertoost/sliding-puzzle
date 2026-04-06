import { TestBed } from '@angular/core/testing';

import { PuzzleService } from './puzzle-service';

describe('PuzzleService', () => {
  let service: PuzzleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuzzleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializePuzzle', () => {
    it('should create 15 tiles', () => {
      service.initializePuzzle();
      expect(service.tiles().length).toBe(15);
    });

    it('should set empty position to 15', () => {
      service.initializePuzzle();
      expect(service.emptyPosition()).toBe(15);
    });

    it('should set move count to 0', () => {
      service.initializePuzzle();
      expect(service.moveCount()).toBe(0);
    });

    it('should set isComplete to false', () => {
      service.initializePuzzle();
      expect(service.isComplete()).toBe(false);
    });

    it('should generate tiles with values 1-15', () => {
      service.initializePuzzle();
      const values = service.tiles().map(t => t.value).sort((a, b) => a - b);
      expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });
  });

  describe('canMoveTile', () => {
    beforeEach(() => {
      service.initializePuzzle();
    });

    it('should return true for tile adjacent to empty position horizontally', () => {
      service.emptyPosition.set(5);
      expect(service.canMoveTile(4)).toBe(true);
      expect(service.canMoveTile(6)).toBe(true);
    });

    it('should return true for tile adjacent to empty position vertically', () => {
      service.emptyPosition.set(5);
      expect(service.canMoveTile(1)).toBe(true);
      expect(service.canMoveTile(9)).toBe(true);
    });

    it('should return false for tile not adjacent to empty position', () => {
      service.emptyPosition.set(5);
      expect(service.canMoveTile(0)).toBe(false);
      expect(service.canMoveTile(10)).toBe(false);
    });

    it('should return false for diagonal tiles', () => {
      service.emptyPosition.set(5);
      expect(service.canMoveTile(0)).toBe(false);
      expect(service.canMoveTile(2)).toBe(false);
      expect(service.canMoveTile(8)).toBe(false);
      expect(service.canMoveTile(10)).toBe(false);
    });
  });

  describe('moveTile', () => {
    beforeEach(() => {
      service.initializePuzzle();
    });

    it('should move tile to empty position if adjacent', () => {
      const initialEmptyPos = service.emptyPosition();
      const adjacentPos = initialEmptyPos - 1;

      const result = service.moveTile(adjacentPos);

      expect(result).toBe(true);
      expect(service.emptyPosition()).toBe(adjacentPos);
    });

    it('should increment move count when tile is moved', () => {
      const initialMoveCount = service.moveCount();
      const adjacentPos = service.emptyPosition() - 1;

      service.moveTile(adjacentPos);

      expect(service.moveCount()).toBe(initialMoveCount + 1);
    });

    it('should return false and not move tile if not adjacent', () => {
      const initialEmptyPos = service.emptyPosition();
      const initialMoveCount = service.moveCount();

      const result = service.moveTile(0);

      expect(result).toBe(false);
      expect(service.emptyPosition()).toBe(initialEmptyPos);
      expect(service.moveCount()).toBe(initialMoveCount);
    });
  });

  describe('resetPuzzle', () => {
    it('should reset the puzzle to a new random state', () => {
      service.initializePuzzle();
      service.moveTile(14);
      service.moveTile(11);

      service.resetPuzzle();

      expect(service.moveCount()).toBe(0);
      expect(service.isComplete()).toBe(false);
      expect(service.tiles().length).toBe(15);
    });
  });

  describe('checkCompletion', () => {
    it('should set isComplete to true when all tiles are in correct position', () => {
      service.tiles.set([
        { value: 1, correctPosition: 0, currentPosition: 0 },
        { value: 2, correctPosition: 1, currentPosition: 1 },
        { value: 3, correctPosition: 2, currentPosition: 2 },
        { value: 4, correctPosition: 3, currentPosition: 3 },
        { value: 5, correctPosition: 4, currentPosition: 4 },
        { value: 6, correctPosition: 5, currentPosition: 5 },
        { value: 7, correctPosition: 6, currentPosition: 6 },
        { value: 8, correctPosition: 7, currentPosition: 7 },
        { value: 9, correctPosition: 8, currentPosition: 8 },
        { value: 10, correctPosition: 9, currentPosition: 9 },
        { value: 11, correctPosition: 10, currentPosition: 10 },
        { value: 12, correctPosition: 11, currentPosition: 11 },
        { value: 13, correctPosition: 12, currentPosition: 12 },
        { value: 14, correctPosition: 13, currentPosition: 13 },
        { value: 15, correctPosition: 14, currentPosition: 15 },
      ]);
      service.emptyPosition.set(14);

      service.moveTile(15);

      expect(service.isComplete()).toBe(true);
    });
  });
});
