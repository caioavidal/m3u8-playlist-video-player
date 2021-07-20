import { Component, ViewChild } from '@angular/core';
import { M3uParserService } from '../services/m3u-parser.service';
import {ChannelNumberSelectorComponent} from './channel-number-selector/channel-number-selector.component';
import * as jQuery from 'jquery';
import { Group } from 'src/models/group.entity';
import { Channel } from 'src/models/channel.entity';
import { ChannelGridComponent } from './channel-grid/channel-grid.component';
import { GroupListComponent } from './group-list/group-list.component';

declare var Hls;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'm3u8-player';
  playlist;
  currentChannelNumber = 0;
  previousChannel = this.currentChannelNumber;
  currentChannel = null;
  video;
  hls;
  today = new Date();
  timeout;
  timeoutInfo;
  keycode;
  loading = true;
  error = false;
  levels = [];
  level = {};
  groups: Group[] = [];
  channels: Channel[] = [];
  channel: Channel;
  constructor(private m3uParser: M3uParserService) {

  }

  @ViewChild(ChannelNumberSelectorComponent) private channelNumberSelector: ChannelNumberSelectorComponent;

  @ViewChild(ChannelGridComponent) channelGrid:ChannelGridComponent;
  @ViewChild(GroupListComponent) groupList:GroupListComponent;


  preMoveChannel() {
    this.previousChannel = this.currentChannelNumber;
    this.error = false;
    this.loading = true;
    this.hls.destroy();

    //console.log(this.hls.media.videowidth);

    this.showInfo(true);
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.loadChannel();

    }, 300);
  }

  onGroupSelected(group:Group){
    this.channels = group.Channels;
    console.log( this.channels);
  }

  async ngAfterViewInit() {
    window["scope"] = "groups";
    this.registerKeyEvents();
    this.today = new Date();

    this.playlist = await this.m3uParser.parse();
    this.groups = await this.m3uParser.parse();
    
    console.log(this.groups);

    // this.currentChannel = this.getCurrentChannel();


    // document.onkeyup = (event) => {
    //   this.keycode = event.which || event.keyCode;

    //   this.channelNumberSelector.onKeyPressed(this.keycode);

    //   if (this.keycode == 38) {
    //     this.showInfo();
    //     ++this.currentChannelNumber;
    //   }
    //   if (this.keycode == 40) {
    //     this.showInfo();
    //     --this.currentChannelNumber;
    //   }

    //   if (this.keycode == 33) { //channel up
    //     ++this.currentChannelNumber;
    //     this.preMoveChannel();
    //   }

    //   if (this.keycode == 34) { //channel down
    //     this.currentChannelNumber--;
    //     this.preMoveChannel();
    //   }

    //   if (this.keycode == 13) { //enter


    //     this.showInfo(true);

    //     if (this.currentChannelNumber != this.previousChannel) {

    //       this.preMoveChannel();
    //     }

    //   }
    //   this.currentChannel = this.getCurrentChannel();
    // };

    // if (Hls.isSupported()) {
    //   this.video = <any>document.getElementById('video');
    //   this.hls = new Hls(this.config);
    //   this.registerHlsEvents();
    //   this.loadChannel();
    // }
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

  getCurrentChannel(){
    const channel:any = Object.keys(this.playlist)[this.currentChannelNumber];
    return this.playlist[channel][0];
  }

  
  registerHlsEvents() {
    
    this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {

      this.hls.loadSource(this.getCurrentChannel().file);
    });

    this.hls.on(Hls.Events.LEVEL_SWITCHED , (event, data)=>{
     this.level = this.levels[data.level];
    });
    this.hls.on(Hls.Events.BUFFER_CREATED , (event, data)=>{
      console.log('buffer created');
      this.loading = false;

     });

    this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      this.video.play();
      this.resetInfo();
      this.levels = data.levels;
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
    "debug": false,
  };

  registerKeyEvents() {
    document.onkeyup = (event) => {
      this.groupList.onKeyUp(event.key);
      this.channelGrid.onKeyUp(event.key);
      console.log(event.key)
    }
  }

}
