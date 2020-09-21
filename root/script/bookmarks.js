'use_strict';

import $ from 'jquery';
import api from './api';
import store from './store';


/** DATA FORMATTING */
$.fn.extend({
  serializeJson: function () {
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return JSON.stringify(o);
  }
});
const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-bookmark-item')
    .data('item-id');
};


/** DOM MANIPULATION */
//DOM home
const generateMain = function () {
  return `
  <section class="outer-group intro">
    <div class="js-options inner-group">
      <h1>MY BOOKMARKS</h1>
      <div class="error-message"></div>
      <div class="options">
        <div class="js-options-buttons">
          <button id="js-add-bookmark-button" class="js-add-bookmark-button grouped-buttons"></button>
          <select class="js-rating-filter-select grouped-buttons">
            <option value="0">Filter</option>
            <option value="1">1-5 Hearts</option>
            <option value="2">2-5 Hearts</option>
            <option value="3">3-5 Hearts</option>
            <option value="4">4-5 Hearts</option>
            <option value="5">5 Hearts</option>
          </select>
        </div>
      </div>
    </div>
  </section>
  <div class="outer-group padding"></div>
  <section id="js-new-bookmark-form" class="outer-group form"></section>
  <div class="outer-group padding"></div>
  <section class="outer-group list">
    <ul id="js-bookmark-list" class="js-bookmark-list inner-group">
    </ul>
  </section>
  `;
};

//after clicking +new, generate form to fill out info
const generateAddBookmarkForm = function () {
  return `
  <form id="js-new-bookmark" class="js-new-bookmark inner-group">
    <label class="form-item1">
      <fieldset>
        <legend>Title</legend>
        <input type="text" name="title" class="js-bookmark-title-entry" />
      </fieldset>
    </label>
    <label class="form-item2">
      <fieldset>
        <legend>URL</legend>
        <input type="text" name="url" class="js-bookmark-url-entry" />
      </fieldset>
    </label>
    <label class="form-item3">
      <fieldset>
        <legend>Description</legend>
        <textarea name="desc" class="js-bookmark-desc-entry"></textarea>
      </fieldset>
    </label>
    <label class="rate">
      <label>
        <input type="radio" name="rating" value="1" />
        <span class="icon">♥</span>
      </label>
      <label>
        <input type="radio" name="rating" value="2" />
        <span class="icon">♥</span>
        <span class="icon">♥</span>
      </label>
      <label>
        <input type="radio" name="rating" value="3" />
        <span class="icon">♥</span>
        <span class="icon">♥</span>
        <span class="icon">♥</span>   
      </label>
      <label>
        <input type="radio" name="rating" value="4" />
        <span class="icon">♥</span>
        <span class="icon">♥</span>
        <span class="icon">♥</span>
        <span class="icon">♥</span>
      </label>
      <label>
        <input type="radio" name="rating" value="5" />
        <span class="icon">♥</span>
        <span class="icon">♥</span>
        <span class="icon">♥</span>
        <span class="icon">♥</span>
        <span class="icon">♥</span>
      </label>
    </label>
    <button type="submit" class="grouped-buttons buttons">Add</button>
  </form>`;
};

//generate error if form incomplete
const generateErrorMsg = function (message) {
  return `<p tabindex=0>${message} <button id="js-delete-button" class="grouped-buttons js-delete-button">X</button></p>`
};

//once submit is successful after clicking add
//generate the bookmark itself
const generateBookmarkElement = function (bookmark, rating) {
  const bookmarkElement = bookmark.expanded
    ? `
    <li id="bookmark-item" class="js-bookmark-item" data-item-id="${bookmark.id}" tabindex=0>
      <div class="bookmark-container>
        <div class="bookmark-item title">
          <h2>${bookmark.title}</h2>
        </div>
        <div class="rating">
          ${rating}
        </div>
        <div class="expanded">
          <button class="grouped-buttons buttons" onclick="window.open('${bookmark.url}','_blank')">Visit Site</button>
          <div class="desc">
            <p>${bookmark.desc}</p>
          </div>
          <button id="js-delete-bookmark" class="grouped-buttons buttons" tabindex=0>Delete</button>
        </div>      
      </div>
    </li>`
    : `
    <li class="js-bookmark-item" data-item-id="${bookmark.id}" tabindex=0>
      <div class="bookmark-container">
        <div class="bookmark-item title">
          <h2>${bookmark.title}</h2>
        </div>
        <div class="rating">
            ${rating}
        </div>
      </div>
    </li>`
  return bookmarkElement
};
const generateRatingElement = function (num) {
  let rating = '';
  for (let i = 0; i < num; i++) {
    rating += '♥';
  };
  return `<span class="heart">${rating}</span>`
};

//generate list content
const generateBookmarkListString = (bookmarkList) => {
  const bookmarks = bookmarkList.filter((bookmark) => {
    return bookmark.rating >= store.rating
  }).map((bookmark) => generateBookmarkElement(bookmark, generateRatingElement(bookmark.rating)))
  return bookmarks.join('');
};


/** EVENT HANDLERS */
//after clicking +new, toggle event state
const handleAddNewBookmarkClick = () => {
  $('main').on('click', '#js-add-bookmark-button', function () {
    store.toggleAddNewBookmark();
    render();
  });
};

//after clicking add, toggle event state
let handleSubmitNewBookmarkClick = function () {
  $('main').on('submit', '#js-new-bookmark', function (e) {
    e.preventDefault();
    const newBookmarkData = $(e.target).serializeJson();
    api.createBookmark(newBookmarkData)
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        store.toggleAddNewBookmark();
        render();
      })
      .catch((error) => {
        store.setError(error.message)
        renderError();
      });
  });
};

//after clicking X, toggle event state
const handleCloseErrorClick = () => {
  $('main').on('click', '#js-delete-button', () => {
    store.setError();
    renderError();
  });
};
const handleCloseErrorKeydown = () => {
  $('main').on('keydown', '#js-delete-button', (e) => {
    if(e.key === 'Enter') {
      store.setError();
      renderError();
    };
  });
};

//after clicking list element, toggle event state
const handleExpandBookmarkClick = () => {
  $('main').on('click', '.js-bookmark-item', e => {
    const id = getItemIdFromElement(e.currentTarget);
    const bookmark = store.findById(id);
    bookmark.expanded = !bookmark.expanded;
    render();
  });
};
const handleExpandBookmarkKeydown = () => {
  $('main').on('keydown', '.js-bookmark-item', e => {
    if(e.key === 'Enter') {
      const id = getItemIdFromElement(e.currentTarget);
      const bookmark = store.findById(id);
      bookmark.expanded = !bookmark.expanded;
      render();
    };
  });
};

//after clicking delete, toggle event state
const handleDeleteBookmarkClick = () => {
  $('main').on('click', '#js-delete-bookmark', e => {
    const id = getItemIdFromElement(e.currentTarget);
    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch((error) => {
        store.setError(error.message)
        renderError();
      });
  });
};
const handleDeleteBookmarkKeydown = () => {
  $('main').on('keydown, #js-delete-bookmark', e => {
    if(e.key === 'Enter') {
      const id = getItemIdFromElement(e.currentTarget);
      api.deleteBookmark(id)
        .then(() => {
          store.findAndDelete(id);
          render();
        })
        .catch((error) => {
          store.setError(error.message)
          renderError();
        });
    };
  }); 
};
//after choosing filter, toggle event state
const handleRatingFilterChange = () => {
  $('main').on('change', '.js-rating-filter-select', e => {
    let val = $(e.target).val();
    store.rating = val;
    render();
  });
};


/** RENDER FUNCTION */
const renderError = () => {
  const el = generateErrorMsg(store.error);
  $('.error-message').html(store.error ? el : '')
};
const render = () => {
  //render homepage
  $('main').html(generateMain());
  $('.js-add-bookmark-button').html(!store.addNewBookmark ? '+ New' : 'Cancel');

  //render addBookmarkForm
  $('#js-new-bookmark-form').html(store.addNewBookmark ? generateAddBookmarkForm() : '');

  //render errorMsg
  renderError();

  //render bookmarkListString
  let bookmarks = [...store.bookmarks];
  const bookmarkListString = generateBookmarkListString(bookmarks);
  $('#js-bookmark-list').html(bookmarkListString);
};


const bindEventListeners = () => {
  handleAddNewBookmarkClick();
  handleSubmitNewBookmarkClick();
  handleCloseErrorClick();
  handleCloseErrorKeydown();
  handleExpandBookmarkClick();
  handleExpandBookmarkKeydown();
  handleDeleteBookmarkClick();
  handleDeleteBookmarkKeydown();
  handleRatingFilterChange();

};

export default {
  bindEventListeners,
  render
}