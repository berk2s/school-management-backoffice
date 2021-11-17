import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTeachingSubjectComponent } from './update-teaching-subject.component';

describe('UpdateTeachingSubjectComponent', () => {
  let component: UpdateTeachingSubjectComponent;
  let fixture: ComponentFixture<UpdateTeachingSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTeachingSubjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTeachingSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
