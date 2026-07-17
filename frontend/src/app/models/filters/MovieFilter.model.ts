export interface MovieFilter {
  name: string;
  genre: string;
  priceRange: [number, number];
  year: number | null;
  director: string;
  actor: string;
}

export const DEFAULT_MOVIES_FILTERS: MovieFilter = {
  name: "",
  genre: "",
  priceRange: [0, 50],
  year: null,
  director: "",
  actor: "",
};