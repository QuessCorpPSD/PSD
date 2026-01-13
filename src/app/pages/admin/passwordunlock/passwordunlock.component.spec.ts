import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordunlockComponent } from './passwordunlock.component';

describe('PasswordunlockComponent', () => {
  let component: PasswordunlockComponent;
  let fixture: ComponentFixture<PasswordunlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordunlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordunlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
