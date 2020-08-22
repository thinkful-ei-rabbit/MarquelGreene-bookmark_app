
import $ from 'jquery';
import api from './../api';
import store from './../store';


//render list
const generateBookmarkList = function(bookmarkList){
  const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
  return bookmarks.join('');
};
//after clicking add new, generate form to fill out info
const generateAddBookmarkForm = function(){
  return `
  <form id="js-new-bookmark-form" class="js-new-bookmark-form">
    <div class="bookmark-form">
      <fieldset>
        <legend>Title</legend>
        <input type="text" name="title" class="js-bookmark-title-entry" required />
      </fieldset>
      <fieldset>
        <legend>URL</legend>
        <input type="text" name="url" class="js-bookmark-url-entry" required />
      </fieldset>
    </div>
    <div class="bookmark-form">
      <fieldset>
        <legend>Description</legend>
        <textarea name="desc" class="js-bookmark-desc-entry" required>
        </textarea>
      </fieldset>
    </div>
    <div class="rate bookmark-form">
      <label>
        <input type="radio" name="rating" value="1" required/>
        <span class="icon">★</span>
      </label>
      <label>
        <input type="radio" name="rating" value="2" />
        <span class="icon">★</span>
        <span class="icon">★</span>
      </label>
      <label>
        <input type="radio" name="rating" value="3" />
        <span class="icon">★</span>
        <span class="icon">★</span>
        <span class="icon">★</span>   
      </label>
      <label>
        <input type="radio" name="rating" value="4" />
        <span class="icon">★</span>
        <span class="icon">★</span>
        <span class="icon">★</span>
        <span class="icon">★</span>
      </label>
      <label>
        <input type="radio" name="rating" value="5" />
        <span class="icon">★</span>
        <span class="icon">★</span>
        <span class="icon">★</span>
        <span class="icon">★</span>
        <span class="icon">★</span>
      </label>
    </div>
    <button type="submit">add</button>
  </form>`;
};

const generateBookmarkElement = function (bookmark, rating) {
  return `
  <li class="js-bookmark-item" data-item-id="${bookmark.id}">
    <div class="standard">
      <h2>${bookmark.title}</h2>
    </div>
    <div class="expanded">
      <div class="rating">
        <span class="icon>★★★★★</span>
        ${rating}
      </div>
    </div>
  </li>`
};
//render form
const render = () => {
  renderError();
  if (store.addNewBookmark) {
    $('.js-add-new-bookmark').html(generateAddBookmarkForm());
  } else {
    $('.js-add-new-bookmark').empty();
  }
  let bookmarks = [...store.bookmarks];
  // render the shopping list in the DOM
  const bookmarkListString = generateBookmarkList(bookmarks);
  // insert that HTML into the DOM
  $('.js-add-bookmark').html(generateAddBookmarkButton());
  $('#js-bookmark-list').html(bookmarkListString);
};

//after clicking add, add bookmark to list
const handleAddNewBookmarkClick = () => {
  $('.js-add-bookmark').click(() => {
    store.toggleAddNewBookmark();
    render();
  });
};

const handleSubmitNewBookmark = () => {
  $('.js-add-new-bookmark').on('submit', '.js-add-new-bookmark-form', e => {
    e.preventDefault();
    let newBookmarkData = $(e.target).serializeJson();
    api.createBookmark(newBookmarkData)
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        store.toggleAddNewBookmark();
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
  });
};
//after clicking description, give detailed view of bookmark
const handleClickToExpandBookmark = () => {
  $('#js-bookmark-list').on('click', '.top-half', e => {
    const id = getItemIdFromElement(e.currentTarget);
    const bookmark = store.findById(id);
    store.findAndUpdate(id, { expand: !bookmark.expand });
    render();
  });
};


$.fn.extend({
  serializeJson: function () {
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return JSON.stringify(o);
  }
});

const bindEventListeners = () => {
  handleAddNewBookmarkClick();
  handleSubmitNewBookmark();
  handleClickToExpandBookmark();
};

export default {
  bindEventListeners,
  render
};