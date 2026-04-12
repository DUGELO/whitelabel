import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { RecipeNotFound } from './recipe-not-found';

describe('RecipeNotFound', () => {
  let component: RecipeNotFound;
  let fixture: ComponentFixture<RecipeNotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeNotFound],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeNotFound);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
