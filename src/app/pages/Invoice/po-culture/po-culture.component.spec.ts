import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoCultureComponent } from './po-culture.component';

describe('PoCultureComponent', () => {
  let component: PoCultureComponent;
  let fixture: ComponentFixture<PoCultureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoCultureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoCultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
s
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
