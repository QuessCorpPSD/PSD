import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrsjobsubcategoryComponent } from './qrsjobsubcategory.component';

describe('QrsjobsubcategoryComponent', () => {
  let component: QrsjobsubcategoryComponent;
  let fixture: ComponentFixture<QrsjobsubcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrsjobsubcategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrsjobsubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
