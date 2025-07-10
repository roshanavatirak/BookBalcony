import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useFavouriteBookIds() {
  const [favouriteIds, setFavouriteIds] = useState([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const headers = {
          id: localStorage.getItem("id"),
          authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.get("http://localhost:3000/api/v1/get-favourite-books", { headers });
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
