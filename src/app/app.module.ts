import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { ChannelNumberSelectorComponent } from './channel-number-selector/channel-number-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    ChannelNumberSelectorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
