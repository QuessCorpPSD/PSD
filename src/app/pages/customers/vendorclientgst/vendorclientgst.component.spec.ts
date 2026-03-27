import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorclientgstComponent } from './vendorclientgst.component';

describe('VendorclientgstComponent', () => {
  let component: VendorclientgstComponent;
  let fixture: ComponentFixture<VendorclientgstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorclientgstComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorclientgstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
