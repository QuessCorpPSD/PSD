import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientofficeaddressComponent } from './clientofficeaddress.component';

describe('ClientofficeaddressComponent', () => {
  let component: ClientofficeaddressComponent;
  let fixture: ComponentFixture<ClientofficeaddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientofficeaddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientofficeaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
