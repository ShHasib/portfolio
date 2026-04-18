import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactInput {
    name: string;
    email: string;
    message: string;
}
export type Timestamp = bigint;
export interface ProjectInput {
    techTags: Array<string>;
    title: string;
    order: bigint;
    description: string;
    sourceUrl: string;
    imageUrl: string;
    visible: boolean;
    liveUrl: string;
}
export interface ContactSubmission {
    id: ContactId;
    name: string;
    read: boolean;
    email: string;
    message: string;
    timestamp: Timestamp;
}
export interface SocialLink {
    url: string;
    title: string;
    icon: string;
}
export type ProjectId = bigint;
export interface AboutInfo {
    bio: string;
    socialLinks: Array<SocialLink>;
    profilePhotoUrl: string;
}
export type ContactId = bigint;
export interface Project {
    id: ProjectId;
    techTags: Array<string>;
    title: string;
    order: bigint;
    description: string;
    sourceUrl: string;
    imageUrl: string;
    visible: boolean;
    liveUrl: string;
}
export interface backendInterface {
    addProject(input: ProjectInput): Promise<Project>;
    deleteProject(id: ProjectId): Promise<boolean>;
    getAbout(): Promise<AboutInfo | null>;
    getContactSubmissions(): Promise<Array<ContactSubmission>>;
    getProject(id: ProjectId): Promise<Project | null>;
    getProjects(): Promise<Array<Project>>;
    initOwner(): Promise<boolean>;
    isOwner(): Promise<boolean>;
    markContactRead(id: ContactId): Promise<boolean>;
    submitContact(input: ContactInput): Promise<ContactSubmission>;
    updateAbout(bio: string, socialLinks: Array<SocialLink>): Promise<void>;
    updateProfilePhoto(photoUrl: string): Promise<void>;
    updateProject(id: ProjectId, input: ProjectInput): Promise<boolean>;
}
