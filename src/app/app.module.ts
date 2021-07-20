import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { ChannelNumberSelectorComponent } from './channel-number-selector/channel-number-selector.component';
import { GroupListComponent } from './group-list/group-list.component';
import { ChannelGridComponent } from './channel-grid/channel-grid.component';
import { ChannelPreviewComponent } from './channel-preview/channel-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    ChannelNumberSelectorComponent,
    GroupListComponent,
    ChannelGridComponent,
    ChannelPreviewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
