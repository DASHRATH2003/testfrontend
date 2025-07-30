export interface BaseItem {
  id: string;
  title: string;
  type: 'movie' | 'tvshow';
  director: string;
  budget: number;
  location: string;
  duration: number;
  poster?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Movie extends BaseItem {
  type: 'movie';
  year: number;
}

export interface TVShow extends BaseItem {
  type: 'tvshow';
  startYear: number;
  endYear?: number;
}

export type MediaItem = Movie | TVShow;

export type ColumnValue = string | number | undefined; 