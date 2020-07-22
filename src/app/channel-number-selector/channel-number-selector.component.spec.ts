import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelNumberSelectorComponent } from './channel-number-selector.component';

describe('ChannelNumberSelectorComponent', () => {
  let component: ChannelNumberSelectorComponent;
  let fixture: ComponentFixture<ChannelNumberSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelNumberSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelNumberSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
