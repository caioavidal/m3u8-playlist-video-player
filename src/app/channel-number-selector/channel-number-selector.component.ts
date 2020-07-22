import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'channel-number-selector',
  templateUrl: './channel-number-selector.component.html',
  styleUrls: ['./channel-number-selector.component.css']
})
export class ChannelNumberSelectorComponent implements OnInit {

  channelNumber = "";
  constructor() { }
  ngOnInit() { }

  ngAfterViewInit(): void {
  }

  onKeyPressed(keycode:number){
    if(this.channelNumber.length < 4 && keycode > 95 && keycode < 106){
    this.channelNumber += keycode - 96;
    }
  }


}
