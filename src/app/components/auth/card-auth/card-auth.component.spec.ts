import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAuthComponent } from './card-auth.component';

describe('CardAuthComponent', () => {
  let component: CardAuthComponent;
  let fixture: ComponentFixture<CardAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
