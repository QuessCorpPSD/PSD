import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrsservicechargetypeComponent } from './qrsservicechargetype.component';

describe('QrsservicechargetypeComponent', () => {
  let component: QrsservicechargetypeComponent;
  let fixture: ComponentFixture<QrsservicechargetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrsservicechargetypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrsservicechargetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
