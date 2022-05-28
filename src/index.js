import './sass/main.scss';
import { fetchPictures } from './fetchPictures.js';
import Notiflix from 'notiflix';
import markupCard from './templetes/markupCard.hbs';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import debounce from 'lodash.debounce';
import { registerDecorator } from 'handlebars';

const refs = {
  formEl: document.querySelector('.search-form'),
  divEl: document.querySelector('.gallery'),
  listEl: document.querySelector('.list-gallery'),
  buttonEl: document.querySelector('.load-more'),
};

refs.formEl.addEventListener('submit', onFormSubmit);
refs.buttonEl.addEventListener('click', onButtonClick);

// let currentPage = 1;

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
    if (resp.totalHits) {
    
      Notiflix.Notify.success(`Hooray! We found ${resp.totalHits} images.`);
   
      createMarkup(resp.hits);
      gallery.refresh();
      refs.buttonEl.classList.remove('hidden');
    }
  } catch (error) {
    console.log(error.stack);
  }
  if (refs.buttonEl.classList.contains('hidden')) {
   
    gallery.refresh();
  }
}

function createMarkup(value) {
  const markup = markupCard(value);
  refs.listEl.insertAdjacentHTML('afterbegin', markup);
 
}
let gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  showCounter: false,
  close: true,
});

async function onButtonClick(event) {
    const searchValue = event.currentTarget.searchQuery;
 await fetchPictures(searchValue);
 onScroll()
  // const searchValue = event.currentTarget.searchQuery.value;
  // currentPage += 1;
  // const resp = await fetchPictures(searchValue);
  // if(resp.totalhits.legnth !== resp.totalHits.legnth) {
  //   currentPage += 1;
  //   console.log('load more');
  // } else{
  //   Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  // }


}

function onScroll (){
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}