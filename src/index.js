import './sass/main.scss';
import { fetchPictures } from './fetchPictures.js';
import Notiflix from 'notiflix';
import markupCard from './templetes/markupCard.hbs';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import debounce from 'lodash.debounce';


const refs = {
  formEl: document.querySelector('.search-form'),
  divEl: document.querySelector('.gallery'),
  listEl: document.querySelector('.list-gallery'),
  buttonEl: document.querySelector('.load-more'),
};

refs.formEl.addEventListener('submit', onFormSubmit);
refs.buttonEl.addEventListener('click', onButtonClick);
refs.buttonEl.classList.add('hidden');


async function onButtonClick(event) {
    // let currentPage = page;
  
  // refs.buttonEl.classList.remove('hidden');
}

let items = [];

async function onFormSubmit(event) {
  event.preventDefault();
  

  const searchValue = event.currentTarget.searchQuery.value;

  if (searchValue === '') {
    return;
  }
  try {
    const resp = await fetchPictures(searchValue);
  
    
    if (resp.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }
    gallery.refresh();
    createMarkup(resp.hits);
    console.log(resp.hits);

  } catch (error) {
    console.log(error.stack);
  }

}

function createMarkup(value) {
  const markup = markupCard(value);
  refs.listEl.insertAdjacentHTML('afterbegin', markup);
  
}

let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  showCounter: false,
});
gallery.refresh();
console.log(gallery);
