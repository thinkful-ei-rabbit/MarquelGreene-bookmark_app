'use_strict';

const BASE_URL = 'https://thinkful-list-api.herokuapp.com/marquel';

const getBookmarks = () => {
  return fetch(`${BASE_URL}/bookmarks`);
};

const createBookmark = (newBookmark) => {
  return fetch(`${BASE_URL}/bookmarks`, {method:'POST',headers:{'Content-Type': 'application/json'}, body: newBookmark});
};

const updateBookmark = (id, obj) => {
  let newBookmark = JSON.stringify(obj);
  return fetch(`${BASE_URL}/bookmarks/${id}`, {method:'PATCH',headers:{'Content-Type': 'application/json'}, body: newBookmark});
};

const deleteBookmark = (id) => {
  return fetch(`${BASE_URL}/bookmarks/${id}`, {method:'DELETE'});
};

const fetch = (...args) => {
  let error;
  return fetch(...args)
    .then(res => {
      if (!res.ok) {
        error = { code: res.status };
        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }
      return res.json();
    })
    .then(data =>{
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
};

export default {
  getBookmarks,
  createBookmark,
  deleteBookmark,
  updateBookmark
};