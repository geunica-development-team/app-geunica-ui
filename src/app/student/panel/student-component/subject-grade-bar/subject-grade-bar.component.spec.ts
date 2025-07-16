import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectGradeBarComponent } from './subject-grade-bar.component';

describe('SubjectGradeBarComponent', () => {
  let component: SubjectGradeBarComponent;
  let fixture: ComponentFixture<SubjectGradeBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectGradeBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectGradeBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
