import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleBoard } from './puzzle-board';
import { PuzzleService } from '../puzzle-service';

describe('PuzzleBoard', () => {
  let component: PuzzleBoard;
  let fixture: ComponentFixture<PuzzleBoard>;
  let puzzleService: PuzzleService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuzzleBoard],
      providers: [PuzzleService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuzzleBoard);
    component = fixture.componentInstance;
    puzzleService = TestBed.inject(PuzzleService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize puzzle on ngOnInit', () => {
    spyOn(puzzleService, 'initializePuzzle');

    component.ngOnInit();

    expect(puzzleService.initializePuzzle).toHaveBeenCalled();
  });

  it('should display the move count', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const moveCount = compiled.querySelector('.value');
    expect(moveCount).toBeTruthy();
  });

  it('should call puzzleService.canMoveTile when checking if tile can move', () => {
    spyOn(puzzleService, 'canMoveTile').and.returnValue(true);

    component.canMoveTile(5);

    expect(puzzleService.canMoveTile).toHaveBeenCalledWith(5);
  });

  it('should call puzzleService.moveTile when tile is clicked', () => {
    spyOn(puzzleService, 'moveTile');

    component.onTileClick(5);

    expect(puzzleService.moveTile).toHaveBeenCalledWith(5);
  });

  it('should call puzzleService.resetPuzzle when reset button is clicked', () => {
    spyOn(puzzleService, 'resetPuzzle');

    component.resetPuzzle();

    expect(puzzleService.resetPuzzle).toHaveBeenCalled();
  });

  it('should display completion message when puzzle is complete', () => {
    puzzleService.isComplete.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const completionMessage = compiled.querySelector('.completion-message');
    expect(completionMessage).toBeTruthy();
    expect(completionMessage?.textContent).toContain('Congratulations');
  });

  it('should not display completion message when puzzle is not complete', () => {
    puzzleService.isComplete.set(false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const completionMessage = compiled.querySelector('.completion-message');
    expect(completionMessage).toBeFalsy();
  });

  it('should render 16 grid positions', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const puzzleBoard = compiled.querySelector('.puzzle-board');
    const children = puzzleBoard?.children;
    expect(children?.length).toBe(16);
  });

  it('should compute board positions correctly', () => {
    puzzleService.tiles.set([
      { value: 1, correctPosition: 0, currentPosition: 0 },
      { value: 2, correctPosition: 1, currentPosition: 1 },
    ]);

    const positions = component.boardPositions();
    expect(positions.length).toBe(16);
    expect(positions[0]?.value).toBe(1);
    expect(positions[1]?.value).toBe(2);
    expect(positions[2]).toBeNull();
  });
});
