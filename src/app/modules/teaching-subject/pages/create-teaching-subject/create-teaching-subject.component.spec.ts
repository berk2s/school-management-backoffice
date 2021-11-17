import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTeachingSubjectComponent } from './create-teaching-subject.component';

describe('CreateTeachingSubjectComponent', () => {
  let component: CreateTeachingSubjectComponent;
  let fixture: ComponentFixture<CreateTeachingSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTeachingSubjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTeachingSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
