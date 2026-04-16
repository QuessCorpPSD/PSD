import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SezcertificateuploadComponent } from './sezcertificateupload.component';

describe('SezcertificateuploadComponent', () => {
  let component: SezcertificateuploadComponent;
  let fixture: ComponentFixture<SezcertificateuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SezcertificateuploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SezcertificateuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
