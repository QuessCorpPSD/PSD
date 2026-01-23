import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ETDSProcessnavigationComponent } from './e-tdsprocessnavigation.component';

describe('ETDSProcessnavigationComponent', () => {
  let component: ETDSProcessnavigationComponent;
  let fixture: ComponentFixture<ETDSProcessnavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ETDSProcessnavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ETDSProcessnavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
