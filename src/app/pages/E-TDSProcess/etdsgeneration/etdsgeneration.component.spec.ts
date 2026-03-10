import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ETDSGenerationComponent } from './etdsgeneration.component';

describe('ETDSGenerationComponent', () => {
  let component: ETDSGenerationComponent;
  let fixture: ComponentFixture<ETDSGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ETDSGenerationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ETDSGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
