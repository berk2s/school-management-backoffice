import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGradeCategoryComponent } from './update-grade-category.component';

describe('UpdateGradeCategoryComponent', () => {
  let component: UpdateGradeCategoryComponent;
  let fixture: ComponentFixture<UpdateGradeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateGradeCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateGradeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
