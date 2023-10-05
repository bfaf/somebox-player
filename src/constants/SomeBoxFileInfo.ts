export interface SomeBoxFileInfo {
    id: number;
    filename: string;
    originalFilename: string;
    screenshotName: string;
    duration: number;
    readableDuration: string; // format 'HH:MM:SS'
    resumeFromTime: number;
};
