const express = require('express');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const bookmarksController = express.Router();

  // Modify a bookmark
  bookmarksController.patch('/:id', onlyLoggedIn, (req, res) => {

    dataLoader.bookmarkBelongsToUser(req.params.id, req.user.id) // need to create this function
    .then(() => {
      return dataLoader.updateBookmark(req.params.id, { //need to create this function
        title: req.body.title,
        description: req.body.description
      });
    })
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
  });

  // Delete a bookmark
  bookmarksController.delete('/:id', onlyLoggedIn, (req, res) => {

    dataLoader.bookmarkBelongsToUser(req.params.id, req.user.id) // need to create function
    .then(() => {
      return dataLoader.deleteBoard(req.params.id); //need to create function
    })
    .then(() => res.status(204).end())
    .catch(err => res.status(400).json(err));
  });

  return bookmarksController;
};
