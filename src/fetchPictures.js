import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '27598952-802517bdfa4ff8ef34e84ef82';

const params = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
});

export async function fetchPictures(value, page) {
  //   const response = await fetch(`${BASE_URL}?key=${KEY}&q=${value}&${params}&${page}`);
  //   return await response.json();
  return await axios.get(`${BASE_URL}?key=${KEY}&q=${value}&${params}&page=${page}`).then(response => {
    return response.data;
  });
}
