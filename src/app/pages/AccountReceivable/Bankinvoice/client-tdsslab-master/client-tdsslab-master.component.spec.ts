import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTDSSlabMasterComponent } from './client-tdsslab-master.component';

describe('ClientTDSSlabMasterComponent', () => {
  let component: ClientTDSSlabMasterComponent;
  let fixture: ComponentFixture<ClientTDSSlabMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientTDSSlabMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientTDSSlabMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
