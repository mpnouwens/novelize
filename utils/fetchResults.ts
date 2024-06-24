import axios from "axios";

export const fetchSearchResults = async (search: string) => {
  const response = await axios.get(`/search/api/${search}`);
  return response.data;
};
