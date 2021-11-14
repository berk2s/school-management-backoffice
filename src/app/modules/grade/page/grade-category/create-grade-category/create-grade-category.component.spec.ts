import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGradeCategoryComponent } from './create-grade-category.component';

describe('CreateGradeCategoryComponent', () => {
  let component: CreateGradeCategoryComponent;
  let fixture: ComponentFixture<CreateGradeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGradeCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGradeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
