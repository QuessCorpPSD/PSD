import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicelayoutComponent } from './invoicelayout.component';

describe('InvoicelayoutComponent', () => {
  let component: InvoicelayoutComponent;
  let fixture: ComponentFixture<InvoicelayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicelayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicelayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
