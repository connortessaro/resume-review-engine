export interface RewriteEntry {
  id: number;
  original: string;
  improved: string;
  mode: string;
  timestamp: string;
  explanation?: string;
}