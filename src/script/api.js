'use_strict';

const BASE_URL = 'https://thinkful-list-api.herokuapp.com/marquel/bookmarks';


const fetchPlease = (...args) => {
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

const getBookmarks = () => {
  return fetchPlease(`${BASE_URL}`);
};

const createBookmark = (newBookmark) => {
  return fetchPlease(`${BASE_URL}`, 
  {
    method:'POST',
    headers:
    {
      'Content-Type': 'application/json'
    }, 
    body: newBookmark
  });
};

const deleteBookmark = (id) => {
  return fetchPlease(`${BASE_URL}/${id}`, {method:'DELETE'});
};


export default {
  getBookmarks,
  createBookmark,
  deleteBookmark,
};