import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTeachingSubjectComponent } from './list-teaching-subject.component';

describe('ListTeachingSubjectComponent', () => {
  let component: ListTeachingSubjectComponent;
  let fixture: ComponentFixture<ListTeachingSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTeachingSubjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTeachingSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
