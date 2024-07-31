import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogReportingComponent } from './log-reporting.component';

describe('LogReportingComponent', () => {
  let component: LogReportingComponent;
  let fixture: ComponentFixture<LogReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
