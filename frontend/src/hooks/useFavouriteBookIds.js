import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

export default function useFavouriteBookIds() {
  const [favouriteIds, setFavouriteIds] = useState([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        if (!id || !token) return;

        const headers = {
          id,
          authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`${API_URL}/get-favourite-books`, { headers });
        const favs = response.data.data || [];
        const ids = favs.map(book => book._id);
        setFavouriteIds(ids);
      } catch (err) {
        console.error("Failed to fetch favourite books", err);
      }
    };
    fetchFavourites();
  }, []);

  return favouriteIds;
}
