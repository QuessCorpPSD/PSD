import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HSNSACComponent } from './hsnsac.component';

describe('HSNSACComponent', () => {
  let component: HSNSACComponent;
  let fixture: ComponentFixture<HSNSACComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HSNSACComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HSNSACComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
