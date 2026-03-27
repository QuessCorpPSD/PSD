import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpfrontmatrixComponent } from './upfrontmatrix.component';

describe('UpfrontmatrixComponent', () => {
  let component: UpfrontmatrixComponent;
  let fixture: ComponentFixture<UpfrontmatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpfrontmatrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpfrontmatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
