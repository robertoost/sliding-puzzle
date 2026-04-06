import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { Tile } from './tile';
import { TileData } from '../puzzle-service';

describe('Tile', () => {
  let component: Tile;
  let fixture: ComponentFixture<Tile>;
  let componentRef: ComponentRef<Tile>;

  const mockTileData: TileData = {
    value: 6,
    correctPosition: 5,
    currentPosition: 8
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tile);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('tile', mockTileData);
    componentRef.setInput('isMovable', false);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the tile value', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const tileNumber = compiled.querySelector('.tile-number');
    expect(tileNumber?.textContent).toContain('6');
  });

  it('should emit clicked event when tile is clicked and movable', () => {
    componentRef.setInput('isMovable', true);
    fixture.detectChanges();

    let emittedPosition: number | undefined;
    component.clicked.subscribe((position: number) => {
      emittedPosition = position;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const tileElement = compiled.querySelector('.tile') as HTMLElement;
    tileElement.click();

    expect(emittedPosition).toBe(8);
  });

  it('should not emit clicked event when tile is not movable', () => {
    componentRef.setInput('isMovable', false);
    fixture.detectChanges();

    let emittedPosition: number | undefined;
    component.clicked.subscribe((position: number) => {
      emittedPosition = position;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const tileElement = compiled.querySelector('.tile') as HTMLElement;
    tileElement.click();

    expect(emittedPosition).toBeUndefined();
  });

  it('should apply movable class when isMovable is true', () => {
    componentRef.setInput('isMovable', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const tileElement = compiled.querySelector('.tile');
    expect(tileElement?.classList.contains('movable')).toBe(true);
  });

  it('should not apply movable class when isMovable is false', () => {
    componentRef.setInput('isMovable', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const tileElement = compiled.querySelector('.tile');
    expect(tileElement?.classList.contains('movable')).toBe(false);
  });

  it('should calculate correct background position', () => {
    mockTileData
    const position = component.getBackgroundPosition();
    expect(position).toBe('33.333333333333336% 33.333333333333336%');
  });

  it('should calculate background position for first tile', () => {
    componentRef.setInput('tile', { value: 1, correctPosition: 0, currentPosition: 0 });
    fixture.detectChanges();

    const position = component.getBackgroundPosition();
    expect(position).toBe('0% 0%');
  });

  it('should calculate background position for last tile', () => {
    componentRef.setInput('tile', { value: 16, correctPosition: 15, currentPosition: 15 });
    fixture.detectChanges();

    const position = component.getBackgroundPosition();
    expect(position).toBe('100% 100%');
  });
});
