import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionpendingreportComponent } from './collectionpendingreport.component';

describe('CollectionpendingreportComponent', () => {
  let component: CollectionpendingreportComponent;
  let fixture: ComponentFixture<CollectionpendingreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionpendingreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionpendingreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
