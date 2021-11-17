import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachStudentComponent } from './attach-student.component';

describe('AttachStudentComponent', () => {
  let component: AttachStudentComponent;
  let fixture: ComponentFixture<AttachStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
