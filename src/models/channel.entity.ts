import { Track } from "./track.entity";

export class Channel{
    /**
     *
     */
    constructor(name:string, logo: string, track: Track) {
        this.Name = name;
        this.Logo = logo;
        this.Tracks = [track];
    }
    
    public Name: string;
    public Logo: string;
    public Tracks: Track[];
}