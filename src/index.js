import './css/styles.css';
import { Notify } from 'notiflix';
import { galleryList } from './js/gallery';
const axios = require('axios').default;

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const moreBtn = document.querySelector('.more');
const input = document.querySelector('input');

const API_KEY = '33229553-8ccb266084a726d2c0c03d9dc';
let page = 1;
let valueInput = '';
let totalHits = '';

form.addEventListener('submit', onSubmit);
moreBtn.addEventListener('click', onClick);

function onSubmit(el) {
  el.preventDefault();
  gallery.innerHTML = '';
  valueInput = el.currentTarget.elements.searchQuery.value.trim();
  if (!moreBtn.classList.contains('visually-hidden')) {
    moreBtn.classList.add('visually-hidden');
  }
  if (valueInput === '') {
    Notify.failure('Enter a query');
  } else {
    page = 1;

    getPicture(valueInput).then(() => {
      page += 1;  
      input.value = '';
    });
  }
}

async function getPicture(name) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    if (response.data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    let arr = response.data.hits;
    let lastPage = Math.ceil(response.data.totalHits / 40);
    totalHits = response.data.totalHits;

    makeListGallery(arr);

    if (response.data.total > 40) {
      moreBtn.classList.remove('visually-hidden');
    }
    if (page === lastPage) {
      if (!moreBtn.classList.contains('visually-hidden')) {
        moreBtn.classList.add('visually-hidden');
      }
      if (response.data.total <= 40) {
        return;
      }
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.error(error);
  }
}

function makeListGallery(data) {
  const markup = galleryList(data);
  gallery.insertAdjacentHTML('beforeend', markup);
}

function onClick(el) {
  el.preventDefault();
  getPicture(valueInput).then(() => {
    page += 1; 
  });
}