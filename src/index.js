import './sass/main.scss';
import { fetchPictures } from './fetchPictures.js';
import markupCard from './templetes/markupCard.hbs';

import Notiflix, { Report } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.querySelector('.search-form'),
  divEl: document.querySelector('.gallery'),
  listEl: document.querySelector('.list-gallery'),
  buttonEl: document.querySelector('.load-more'),
};

refs.formEl.addEventListener('submit', onFormSubmit);
refs.buttonEl.addEventListener('click', onLoadMoreClick);

let currentPage = 1;
let searchValue = '';
let hits = 0;

async function onFormSubmit(event) {
  event.preventDefault();
  refs.listEl.innerHTML = '';
  searchValue = event.currentTarget.searchQuery.value;
  console.log(searchValue);
  currentPage = 1;
  console.log(currentPage);

  refs.formEl.reset();
  refs.buttonEl.classList.add('hidden');

  if (searchValue === '') {
    return;
  }
  try {
    const resp = await fetchPictures(searchValue, currentPage);
    hits = resp.hits.length;
    if (!resp.totalHits) {
      refs.listEl.innerHTML = '';
      refs.buttonEl.classList.add('hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }

    if (resp.totalHits) {
      Notiflix.Notify.success(`Hooray! We found ${resp.totalHits} images.`);
      createMarkup(resp.hits);
      gallery.refresh();
      refs.buttonEl.classList.remove('hidden');
    }
  } catch (error) {
    console.log(error.stack);
  }
}

function createMarkup(value) {
  const markup = markupCard(value);
  refs.listEl.insertAdjacentHTML('beforeend', markup);
}

let gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  showCounter: false,
  close: true,
});

async function onLoadMoreClick(event) {
  try {
    const resp = await fetchPictures(searchValue, currentPage);

    if (hits === resp.totalHits) {
      refs.buttonEl.classList.add('hidden');
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      currentPage += 1;
      createMarkup(resp.hits);
      gallery.refresh();
      hits += resp.hits.length;
    }
  } catch (error) {
    console.log(error.stack);
  }
}

// async function smoothScroll() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
