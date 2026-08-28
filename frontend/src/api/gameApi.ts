import axios from "axios";

const API_URL = "http://localhost:5000/api/games";

export interface Game {
  id: number;
  title: string;
  description: string | null;
  release_date: string | null;
  cover_url: string | null;
  status: "bucket_list" | "playing" | "completed" | "dropped";
  rating: number | null;
  progress: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Get all games
export const getGames = async (): Promise<Game[]> => {
  const response = await axios.get<Game[]>(API_URL);
  return response.data;
};

// Get one game
export const getGameById = async (id: number): Promise<Game> => {
  const response = await axios.get<Game>(`${API_URL}/${id}`);
  return response.data;
};

// Create game
export const createGame = async (
  game: Omit<Game, "id" | "created_at" | "updated_at">
): Promise<Game> => {
  const response = await axios.post<Game>(API_URL, game);
  return response.data;
};

// Update game
export const updateGame = async (
  id: number,
  game: Omit<Game, "id" | "created_at" | "updated_at">
): Promise<Game> => {
  const response = await axios.put<Game>(`${API_URL}/${id}`, game);
  return response.data;
};

// Delete game
export const deleteGame = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};