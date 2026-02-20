export interface AsyncState {
  type: 'success' | 'error' | 'idle' | 'loading';
  errorMessage?: string;
}