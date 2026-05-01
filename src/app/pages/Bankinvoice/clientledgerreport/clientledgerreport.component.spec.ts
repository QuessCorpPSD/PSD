import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientledgerreportComponent } from './clientledgerreport.component';

describe('ClientledgerreportComponent', () => {
  let component: ClientledgerreportComponent;
  let fixture: ComponentFixture<ClientledgerreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientledgerreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientledgerreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
