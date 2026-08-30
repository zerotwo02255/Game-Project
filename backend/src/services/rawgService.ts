import axios from "axios";

const RAWG_API_URL = "https://api.rawg.io/api";

const RAWG_API_KEY = process.env.RAWG_API_KEY;

if (!RAWG_API_KEY) {
  throw new Error("RAWG_API_KEY is missing from .env");
}

export const searchRawgGames = async (
  search: string
) => {
  const response = await axios.get(
    `${RAWG_API_URL}/games`,
    {
      params: {
        key: RAWG_API_KEY,
        search,
        page_size: 10,
      },
    }
  );

  return response.data.results;
};

export const getRawgGameById = async (id: number) => {
  const response = await axios.get(
    `${RAWG_API_URL}/games/${id}`,
    {
      params: {
        key: RAWG_API_KEY,
      },
    }
  );

  return response.data;
};