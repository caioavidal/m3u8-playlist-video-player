import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { Track } from "../models/track.entity";
import { Group } from "../models/group.entity";
import { Channel } from "../models/channel.entity";

@Injectable({
  providedIn: 'root'
})
export class M3uParserService {

  constructor(private http: HttpClient) { }

  private EXTM3U = '#EXTM3U';
  private EXTINF = '#EXTINF:';

  private REGEX_PARAMS = /\s*("([^"]+)"|([^=]+))=("([^"]+)"|(\S+))/g;
  private REGEX_DURATION = /\s*(-?\d+)/g;


  async getData() {
    return new Promise((resolve, reject) => {

      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
          var allText = xmlhttp.responseText;
          resolve(allText);
        }
      };
      xmlhttp.open("GET", 'assets/download.m3u', false);
      xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
      xmlhttp.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      xmlhttp.setRequestHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
      xmlhttp.setRequestHeader("Access-Control-Max-Age", "1728000");
      xmlhttp.send(null);
    });
  }

  async parse(): Promise<Group[]> {
    //var groups: Group[] = [];

    var result:any= {};
    result.tracks = [];

    result.groups = {};

    return new Promise((resolve, reject) => {

      this.getData().then((content: any) => {


        var lines = content.split('\n');

        var line, current: any = {}, pos, duration;
        for (var i = 0; i < lines.length; i++) {
          line = lines[i].trim();

          if (line == '') {
            continue;
          }

          if (line.indexOf(this.EXTM3U) == 0) {
            result.header = this.parseParams(line.substr(this.EXTM3U.length));
            continue;
          }

          if (line.indexOf(this.EXTINF) == 0) {
            pos = line.lastIndexOf(',');
            current.title = line.substr(pos + 1).trim();

            line = line.substring(this.EXTINF.length, pos).trim();
            duration = line.match(this.REGEX_DURATION);

            current.length = parseInt(duration[0]);

            current.params = this.parseParams(line.substr(duration[0].length));
            continue;
          }

          if (line.indexOf("#") == 0) {
            continue;
          }

          current.file = line;

          if(result.groups[current.params['group-title']] == null)
          {
            result.groups[current.params['group-title']]  = [];   
          }
          result.groups[current.params['group-title']].push(current);

          current = {};
        }

        var groupNames = Object.keys(result.groups);

        var groups = groupNames.map(g=> new Group(g));
        groups.forEach(group => {
            var channels = result.groups[group.Name].map(t=> new Channel(t.title, t.params['tvg-logo'], new Track(t.title,t.file)));
            group.Channels = channels;
        });

        result = this.group(result);

        resolve(groups);

      });
    });
  }

  private group(data): any{
      _.forEach(data.tracks, (i)=> i.name = i.title.replace(" FHD[H265]","").replace(" FHD","").replace(" HD","").replace(" SD","").replace(" [4K]",""))
      
     return _.groupBy(data.tracks, (i)=>i.name);
  }


  /**
 * Created by solvek on 26.01.16.
 */



  //var util = require('util');

  private parseParams(data) {
    var result = {};

    var m, key, value;

    while ((m = this.REGEX_PARAMS.exec(data)) !== null) {
      if (m.index === this.REGEX_PARAMS.lastIndex) {
        this.REGEX_PARAMS.lastIndex++;
      }

      //console.log(util.inspect(m));

      key = m[2] ? m[2] : m[3];
      value = m[5] ? m[5] : m[6];

      result[key] = value;
    }

    //console.log(util.inspect(result));
    return result;
  }

  private formatParams(params) {
    var result = '';
    for (var key in params) {
      result += ' ' + key + '="' + params[key] + '"';
    }

    return result;
  }


  private format(m3u) {
    var result = this.EXTM3U;
    if (m3u.header) {
      result += this.formatParams(m3u.header);
    }
    result += '\n';
    m3u.tracks.forEach(function (track) {
      result += this.EXTINF
        + track.length
        + this.formatParams(track.params)
        + ","
        + track.title
        + '\n'
        + track.file
        + '\n';
    });

    return result;
  }
}
