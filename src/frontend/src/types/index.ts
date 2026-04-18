export interface SocialLink {
  title: string;
  url: string;
  icon: string;
}

export interface Project {
  id: bigint;
  title: string;
  description: string;
  techTags: string[];
  imageUrl: string;
  liveUrl: string;
  sourceUrl: string;
  order: bigint;
  visible: boolean;
}

export interface AboutInfo {
  bio: string;
  profilePhotoUrl: string;
  socialLinks: SocialLink[];
}

export interface ContactSubmission {
  id: bigint;
  name: string;
  email: string;
  message: string;
  timestamp: bigint;
  read: boolean;
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export interface ProjectInput {
  title: string;
  description: string;
  techTags: string[];
  imageUrl: string;
  liveUrl: string;
  sourceUrl: string;
  order: bigint;
  visible: boolean;
}
