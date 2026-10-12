import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClratrackerComponent } from './clratracker.component';

describe('ClratrackerComponent', () => {
  let component: ClratrackerComponent;
  let fixture: ComponentFixture<ClratrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClratrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClratrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
