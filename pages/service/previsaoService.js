import axios from 'axios';

const API_KEY = 'd6e789dc'; 

export default getWeather = async (city) => {
  try {
    const response = await axios.get(`https://api.hgbrasil.com/weather`, {
      params: {
        key: API_KEY,
        city_name: city
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados climáticos:", error);
    return null;
  }
};