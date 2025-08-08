import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakAddComponent } from './break-add.component';

describe('BreakAddComponent', () => {
  let component: BreakAddComponent;
  let fixture: ComponentFixture<BreakAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreakAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BreakAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
