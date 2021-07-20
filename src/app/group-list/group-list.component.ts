import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Group } from 'src/models/group.entity';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  selected: number = 0;

  constructor() { }

  @Output()
  public onSelected: EventEmitter<Group> = new EventEmitter();


  @Input()
  groups: Group[] = [];

  ngOnInit(): void {
    //this.selectGroup(this.groups[this.selected],this.selected);
  }

  selectGroup(group: Group, index: number): void {
    this.selected = index;
    this.onSelected.emit(group);
  }

  onKeyUp(key: string) {

    if (window["scope"] != "groups") return;

    if (key == "ArrowUp") {
      this.goUp();
    }
    if (key == "ArrowDown") {
      this.goDown();
    }
    if (key == "ArrowRight") {
      window["scope"] = "channels";
    }

    this.selectGroup(this.groups[this.selected], this.selected);
  }

  private goUp() {
    if (this.selected == 0) return;
    this.selected--;
  }
  private goDown() {
    if (this.selected == this.groups.length - 1) return;
    this.selected++;
  }
}
