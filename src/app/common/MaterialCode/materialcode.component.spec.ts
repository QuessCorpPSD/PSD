import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialCodeComponent } from './materialcode.component';

describe('MaterialCodeComponent', () => {
  let component: MaterialCodeComponent;
  let fixture: ComponentFixture<MaterialCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
