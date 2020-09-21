'use_strict';
/** STATE **/
let bookmarks = [];
let addNewBookmark = false;
let error = null
let rating = 0


/** STATE MODIFIERS **/
function findById(id) {
  return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
}

function addBookmark(bookmark) {
  bookmark.expanded = false;
  this.bookmarks.push(bookmark);
}

function toggleAddNewBookmark() {
  this.addNewBookmark = !this.addNewBookmark;
}

function setError(error) {
  this.error = error
}

function findAndDelete(id) {
  this.bookmarks = this.bookmarks.filter(currentItem =>currentItem.id !== id)
}


/** MODULE EXPORT **/
export default {
  bookmarks,
  addNewBookmark,
  error,
  rating,
  findById,
  addBookmark,
  toggleAddNewBookmark,
  setError,
  findAndDelete,
}