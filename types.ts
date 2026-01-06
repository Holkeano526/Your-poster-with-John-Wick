
export interface GeneratedImage {
  url: string;
  timestamp: number;
}

export enum GenerationState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface AppState {
  status: GenerationState;
  userImage: string | null;
  resultImage: string | null;
  error: string | null;
}
