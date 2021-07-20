import { Channel } from "./channel.entity";

export class Group{
    /**
     *
     */
    constructor(name:string) {
       this.Name = name;
    }
    public Name: string;
    public Channels: Channel[];
}