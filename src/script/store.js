'use_strict';

let bookmarks = [];
let addNewBookmark = false;
let rating = 0;
let error = null;

function setError(_error) {
  this.error = error;
}

function findById(id) {
  return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
}

function addBookmark(bookmark) {
  let expand = {expand:false};
  bookmark = {...bookmark, ...expand}
  this.bookmarks.push(bookmark);
  console.log(bookmark);
}

function toggleAddNewBookmark() {
  this.addNewBookmark = !this.addNewBookmark;
}

function findAndUpdate(id, newData) {
  Object.assign(this.bookmarks.find(bookmark => bookmark.id === id), newData);
}

function findAndDelete(id) {
  this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id !== id);
}

export default {
  bookmarks,
  addNewBookmark,
  rating,
  setError,
  findById,
  addBookmark,
  toggleAddNewBookmark,
  findAndUpdate,
  findAndDelete
}