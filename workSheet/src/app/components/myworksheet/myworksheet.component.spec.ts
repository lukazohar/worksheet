import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyworksheetComponent } from './myworksheet.component';

describe('MyworksheetComponent', () => {
  let component: MyworksheetComponent;
  let fixture: ComponentFixture<MyworksheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyworksheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyworksheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
