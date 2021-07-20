import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelPreviewComponent } from './channel-preview.component';

describe('ChannelPreviewComponent', () => {
  let component: ChannelPreviewComponent;
  let fixture: ComponentFixture<ChannelPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
