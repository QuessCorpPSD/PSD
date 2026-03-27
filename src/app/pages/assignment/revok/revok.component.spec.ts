import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokComponent } from './revok.component';

describe('RevokComponent', () => {
  let component: RevokComponent;
  let fixture: ComponentFixture<RevokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevokComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RevokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
