declare var Hls;
import { Component } from '@angular/core';
import { M3uParserService } from './m3u-parser.service';
import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'm3u8-player';
  playlist;
  currentChannel = 0;
  previousChannel = 0;
  video;
  hls;
  today = new Date();
  timeout;
  timeoutInfo;
  startClose = false;
  keycode;
  loading = false;
  error = false;
  constructor(private m3uParser: M3uParserService) {

  }

  preMoveChannel() {
    this.error = false;
    this.loading = true;
    this.hls.destroy();

    this.startClose = false;
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

      if (event.which == 38 || event.keyCode == 38) {
        this.startClose = false;
        ++this.currentChannel;
      }
      if (event.which == 40 || event.keyCode == 40) {
        this.startClose = false;
        --this.currentChannel;
      }

      if (event.which == 33 || event.keyCode == 33) {
        
        this.previousChannel = this.currentChannel++;
        this.preMoveChannel();
      }

      if (event.which == 34 || event.keyCode == 34) {
        this.currentChannel--;
        this.preMoveChannel();
      }

      if (event.which == 13 || event.keyCode == 13) { //enter
        
        this.preMoveChannel();
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
    this.startClose = true;

  }

  loadChannel() {
    // bind them together
    console.log('channel loaded');

    this.hls = new Hls(this.config);
    this.registerHlsEvents();
    this.hls.attachMedia(this.video);

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

    this.hls.on(Hls.Events.ERROR,  (event, data) =>{
      var errorType = data.type;
      var errorDetails = data.details;
      var errorFatal = data.fatal;
      console.log('error');
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
    autoStartLoad: true,
    startPosition: -1,
    debug: false,
    capLevelOnFPSDrop: false,
    capLevelToPlayerSize: false,
    defaultAudioCodec: undefined,
    initialLiveManifestSize: 1,
    maxBufferLength: 30,
    maxMaxBufferLength: 600,
    maxBufferSize: 60*1000*1000,
    maxBufferHole: 0.5,
    lowBufferWatchdogPeriod: 0.5,
    highBufferWatchdogPeriod: 3,
    nudgeOffset: 0.1,
    nudgeMaxRetry: 3,
    maxFragLookUpTolerance: 0.25,
    liveSyncDurationCount: 3,
    liveMaxLatencyDurationCount: Infinity,
    liveDurationInfinity: false,
    liveBackBufferLength: Infinity,
    enableWorker: true,
    enableSoftwareAES: true,
    manifestLoadingTimeOut: 10000,
    manifestLoadingMaxRetry: 1,
    manifestLoadingRetryDelay: 1000,
    manifestLoadingMaxRetryTimeout: 64000,
    startLevel: undefined,
    levelLoadingTimeOut: 10000,
    levelLoadingMaxRetry: 4,
    levelLoadingRetryDelay: 1000,
    levelLoadingMaxRetryTimeout: 64000,
    fragLoadingTimeOut: 20000,
    fragLoadingMaxRetry: 6,
    fragLoadingRetryDelay: 1000,
    fragLoadingMaxRetryTimeout: 64000,
    startFragPrefetch: false,
    testBandwidth: true,
    fpsDroppedMonitoringPeriod: 5000,
    fpsDroppedMonitoringThreshold: 0.2,
    appendErrorMaxRetry: 3,
    enableWebVTT: true,
    enableCEA708Captions: true,
    stretchShortVideoTrack: false,
    maxAudioFramesDrift: 1,
    forceKeyFrameOnDiscontinuity: true,
    abrEwmaFastLive: 3.0,
    abrEwmaSlowLive: 9.0,
    abrEwmaFastVoD: 3.0,
    abrEwmaSlowVoD: 9.0,
    abrEwmaDefaultEstimate: 500000,
    abrBandWidthFactor: 0.95,
    abrBandWidthUpFactor: 0.7,
    abrMaxWithRealBitrate: false,
    maxStarvationDelay: 4,
    maxLoadingDelay: 4,
    minAutoBitrate: 0,
    emeEnabled: false,
    widevineLicenseUrl: undefined,
    drmSystemOptions: {},
};

}
