import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SEZRepositoryComponent } from './sezrepository.component';

describe('SEZRepositoryComponent', () => {
  let component: SEZRepositoryComponent;
  let fixture: ComponentFixture<SEZRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SEZRepositoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SEZRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
