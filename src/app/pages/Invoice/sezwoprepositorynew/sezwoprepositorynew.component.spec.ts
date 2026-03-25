import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SezwoprepositorynewComponent } from './sezwoprepositorynew.component';

describe('SezwoprepositorynewComponent', () => {
  let component: SezwoprepositorynewComponent;
  let fixture: ComponentFixture<SezwoprepositorynewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SezwoprepositorynewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SezwoprepositorynewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
