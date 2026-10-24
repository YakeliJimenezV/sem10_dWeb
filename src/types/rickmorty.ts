
export interface RickMortyLocation {
  name: string;
  url: string;
}

export interface RickMortyCharacter {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: RickMortyLocation;
  location: RickMortyLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface RickMortyResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: RickMortyCharacter[];
}
