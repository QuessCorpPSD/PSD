import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QRSmasterComponent } from './qrsmaster.component';

describe('QRSmasterComponent', () => {
  let component: QRSmasterComponent;
  let fixture: ComponentFixture<QRSmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QRSmasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QRSmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
