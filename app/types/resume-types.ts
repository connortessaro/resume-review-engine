export interface StoredEntry {
  id: number;
  original: Resume;
  improved: Resume;
  mode: string;
  timestamp: string;
  explanation?: string;
}

export interface Resume {
  header?: string[];
  education?: string[];
  summary?: string[];
  experience?: string[];
  projects?: string[];
  skills?: string[];
  certifications?: string[];
  awards?: string[];
}
