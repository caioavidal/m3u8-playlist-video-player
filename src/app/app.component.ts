import { Component, ViewChild } from '@angular/core';
import { M3uParserService } from './m3u-parser.service';
import {ChannelNumberSelectorComponent} from './channel-number-selector/channel-number-selector.component';
import * as jQuery from 'jquery';

declare var Hls;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'm3u8-player';
  playlist;
  currentChannel = 0;
  previousChannel = this.currentChannel;
  video;
  hls;
  today = new Date();
  timeout;
  timeoutInfo;
  keycode;
  loading = false;
  error = false;
  constructor(private m3uParser: M3uParserService) {

  }

  @ViewChild(ChannelNumberSelectorComponent) private channelNumberSelector: ChannelNumberSelectorComponent;

  preMoveChannel() {
    this.previousChannel = this.currentChannel;
    this.error = false;
    this.loading = true;
    this.hls.destroy();

    this.showInfo(true);
    clearTimeout(this.timeout);
    //clearTimeout(this.timeoutInfo);

    this.timeout = setTimeout(() => {
      this.loadChannel()

    }, 300);
  }
  async ngAfterViewInit() {
    this.today = new Date();
    this.playlist = await this.m3uParser.parse();
    console.log(this.playlist);

    document.onkeyup = (event) => {
      this.keycode = event.which || event.keyCode;

      this.channelNumberSelector.onKeyPressed(this.keycode);
      console.log(this.keycode);

      if (this.keycode == 38) {
        this.showInfo();
        ++this.currentChannel;
      }
      if (this.keycode == 40) {
        this.showInfo();
        --this.currentChannel;
      }

      if (this.keycode == 33) { //channel up
        ++this.currentChannel;
        this.preMoveChannel();
      }

      if (this.keycode == 34) { //channel down
        this.currentChannel--;
        this.preMoveChannel();
      }

      if (this.keycode == 13) { //enter


        this.showInfo(true);

        if (this.currentChannel != this.previousChannel) {

          this.preMoveChannel();
        }

      }
    };

    if (Hls.isSupported()) {
      this.video = <any>document.getElementById('video');
      this.hls = new Hls(this.config);
      this.registerHlsEvents();
      this.loadChannel();
    }
  }

  resetInfo() {
    // this.timeoutInfo = window.setTimeout(()=>this.hideInfo = true,5000);
    //setTimeout(() => this.hideInfo = true);
    this.showInfo();
  }

  loadChannel() {
    // bind them together

    this.hls = new Hls(this.config);
    this.registerHlsEvents();
    this.hls.attachMedia(this.video);

  }

  showInfo(fadeCurrent = false) {
    jQuery('#channelInfo').removeClass('close');
    fadeCurrent == true && jQuery('#current').removeClass('fadeInTop');
    window.setTimeout(() => {
      jQuery('#channelInfo').addClass('close');
      fadeCurrent == true && jQuery('#current').addClass('fadeInTop');
    }, 0);
  }

  
  registerHlsEvents() {
    this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      this.hls.loadSource(this.playlist.tracks[this.currentChannel].file);
    });

    this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {

      this.video.play();
      console.log("playing")
      this.resetInfo();
      this.loading = false;
    });

    this.hls.on(Hls.Events.MANIFEST_LOADED, (event, data) => {

      console.log('loaded');
    });

    this.hls.on(Hls.Events.ERROR, (event, data) => {
      var errorType = data.type;
      var errorDetails = data.details;
      var errorFatal = data.fatal;
      console.log('error', data);
      this.error = true;
      this.loading = false;
      switch (data.details) {
        case Hls.ErrorDetails.FRAG_LOAD_ERROR:
          // ....
          break;
        default:
          break;
      }
    });
  }

  config = {
  };

}
