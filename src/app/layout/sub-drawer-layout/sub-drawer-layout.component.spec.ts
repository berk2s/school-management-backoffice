import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubDrawerLayoutComponent } from './sub-drawer-layout.component';

describe('SubDrawerLayoutComponent', () => {
  let component: SubDrawerLayoutComponent;
  let fixture: ComponentFixture<SubDrawerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubDrawerLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubDrawerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
