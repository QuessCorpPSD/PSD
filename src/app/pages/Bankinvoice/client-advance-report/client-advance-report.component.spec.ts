import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAdvanceReportComponent } from './client-advance-report.component';

describe('ClientAdvanceReportComponent', () => {
  let component: ClientAdvanceReportComponent;
  let fixture: ComponentFixture<ClientAdvanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAdvanceReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAdvanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
