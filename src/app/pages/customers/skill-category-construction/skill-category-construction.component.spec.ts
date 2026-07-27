import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillCategoryConstructionComponent } from './skill-category-construction.component';

describe('SkillCategoryConstructionComponent', () => {
  let component: SkillCategoryConstructionComponent;
  let fixture: ComponentFixture<SkillCategoryConstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillCategoryConstructionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillCategoryConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
