'use_strict';

import $ from 'jquery';
import './index.css';
import api from './script/api';
import bookmarkList from './script/bookmarks';
import store from './script/store';

const main = function () {
  api.getBookmarks()
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
      bookmarkList.render();
    });
  bookmarkList.bindEventListeners();
};

$(main);