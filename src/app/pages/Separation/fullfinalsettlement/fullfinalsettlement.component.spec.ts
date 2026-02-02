import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullfinalsettlementComponent } from './fullfinalsettlement.component';

describe('FullfinalsettlementComponent', () => {
  let component: FullfinalsettlementComponent;
  let fixture: ComponentFixture<FullfinalsettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullfinalsettlementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullfinalsettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
