import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeCategoryListComponent } from './grade-category-list.component';

describe('GradeCategoryListComponent', () => {
  let component: GradeCategoryListComponent;
  let fixture: ComponentFixture<GradeCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeCategoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
