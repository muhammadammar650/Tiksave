export type Theme = "bright" | "blue";

export interface SEOData {
  hashtags: {
    broad: string[];
    niche: string[];
    micro: string[];
  };
  titles: string[];
  hooks: string[];
  ctas: string[];
}

export interface VideoData {
  platform: string;
  url: string;
  title: string;
  description: string;
  username: string;
  profilePic: string;
  downloads: {
    hd: string;
    sd: string;
    audio: string;
  };
}
