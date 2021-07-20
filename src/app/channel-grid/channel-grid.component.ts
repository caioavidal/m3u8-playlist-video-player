import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Channel } from 'src/models/channel.entity';

@Component({
  selector: 'app-channel-grid',
  templateUrl: './channel-grid.component.html',
  styleUrls: ['./channel-grid.component.css']
})
export class ChannelGridComponent implements OnInit {
  selected: number = 0;

  constructor() { }

  @Output()
  public onSelected: EventEmitter<Channel> = new EventEmitter();

  @Input()
  channels: Channel[] = [];

  ngOnInit(): void {
    
  }

  selectChannel(channel: Channel, index:number): void {
    this.selected = index;
    this.onSelected.emit(channel);
  }

  onKeyUp(key: string) {

    if (window["scope"] != "channels") return;

    if (key == "ArrowUp") {
      this.goUp();
    }
    if (key == "ArrowDown") {
      this.goDown();
    }
    if (key == "ArrowLeft") {
      window["scope"] = "groups";
    }

    this.selectChannel(this.channels[this.selected], this.selected);
  }

  private goUp() {
    if (this.selected == 0) return;
    this.selected--;
  }
  private goDown() {
    if (this.selected == this.channels.length - 1) return;
    this.selected++;
  }
}
