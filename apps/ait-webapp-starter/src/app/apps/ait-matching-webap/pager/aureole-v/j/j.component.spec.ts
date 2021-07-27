import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JComponent } from './j.component';

describe('JComponent', () => {
  let component: JComponent;
  let fixture: ComponentFixture<JComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
