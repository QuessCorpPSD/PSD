import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrossmarginComponent } from './grossmargin.component';

describe('GrossmarginComponent', () => {
  let component: GrossmarginComponent;
  let fixture: ComponentFixture<GrossmarginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrossmarginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrossmarginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
