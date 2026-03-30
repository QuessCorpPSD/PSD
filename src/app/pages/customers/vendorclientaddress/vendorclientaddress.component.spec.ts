import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorclientaddressComponent } from './vendorclientaddress.component';

describe('VendorclientaddressComponent', () => {
  let component: VendorclientaddressComponent;
  let fixture: ComponentFixture<VendorclientaddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorclientaddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorclientaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
