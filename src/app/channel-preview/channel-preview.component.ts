import { Component, Input, OnInit, Output } from '@angular/core';
import * as Hls from 'hls.js';
import { Channel } from 'src/models/channel.entity';

@Component({
  selector: 'app-channel-preview',
  templateUrl: './channel-preview.component.html',
  styleUrls: ['./channel-preview.component.css']
})
export class ChannelPreviewComponent implements OnInit {

  private _channel: Channel;
  public get channel(): Channel {
    return this._channel;
  }

  @Input()
  public set channel(value: Channel) {
    this._channel = value;
    this.loadChannel();
  }

  hls: any;
  video: any;
  
  constructor() { }

  ngOnInit(): void {
    if (Hls.isSupported()) {
        this.video = <any>document.getElementById('video');
        this.hls = new Hls();
        this.registerHlsEvents();
        //this.loadChannel();
      }
  }

  loadChannel() {
    // bind them together
    this.hls = new Hls();
    this.registerHlsEvents();
    this.hls.attachMedia(this.video);
  }


  registerHlsEvents() {
    
    this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      
      this.hls.loadSource(this.channel.Tracks[0].Source);
    });

    // this.hls.on(Hls.Events.LEVEL_SWITCHED , (event, data)=>{
    //  this.level = this.levels[data.level];
    // });
    // this.hls.on(Hls.Events.BUFFER_CREATED , (event, data)=>{
    //   console.log('buffer created');
    //   this.loading = false;

    //  });

    this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      this.video.play();
      //this.resetInfo();
      //this.levels = data.levels;
    });

    this.hls.on(Hls.Events.ERROR, (event, data) => {
      var errorType = data.type;
      var errorDetails = data.details;
      var errorFatal = data.fatal;
      console.log('error', data);
      // this.error = true;
      // this.loading = false;
      switch (data.details) {
        case Hls.ErrorDetails.FRAG_LOAD_ERROR:
          // ....
          break;
        default:
          break;
      }
    });
  }
}
