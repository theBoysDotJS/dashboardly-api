const express = require('express');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const boardsController = express.Router();

  // Retrieve a list of boards
  boardsController.get('/', (req, res) => {
    dataLoader.getAllBoards({
      page: req.query.page,
      limit: req.query.count
    })
    .then(data => {
		res.json(data)
	})
    .catch(err => res.status(400).json(err));
  });


  // Retrieve a single board
  boardsController.get('/:id', (req, res) => {
    dataLoader.getSingleBoard(req.params.id)
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
  });


  // Create a new board
  boardsController.post('/', onlyLoggedIn, (req, res) => {
	console.log(req.body, 'the body', req.users, 'tha users')
    dataLoader.createBoard({
      ownerId: req.user.users_id,
      title: req.body.title,
      description: req.body.description
    })
    .then(data => res.status(201).json(data))
    .catch(err => res.status(400).json(err));
  });


  // Modify an owned board
  boardsController.patch('/:id', (req, res) => {
    // First check if the board to be PATCHed belongs to the user making the request
	console.log(req.user)
    dataLoader.boardBelongsToUser(req.params.id, req.user.users_id)
    .then(() => {
      return dataLoader.updateBoard(req.params.id, {
        title: req.body.title,
        description: req.body.description
      });
    })
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
  });

  // Delete an owned board
  boardsController.delete('/:id', onlyLoggedIn, (req, res) => {
    // First check if the board to be DELETEd belongs to the user making the request
    dataLoader.boardBelongsToUser(req.params.id, req.user.users_id)
    .then(() => {
      return dataLoader.deleteBoard(req.params.id);
    })
    .then(() => res.status(204).end())
    .catch(err => res.status(400).json(err));
  });


  // Retrieve all the bookmarks for a single board
  boardsController.get('/:id/bookmarks', (req, res) => {
	dataLoader.getAllBookmarksForBoard(req.params.id)
    .then(board => res.status(201).json(board))
    .catch(err => res.status(400).json(err));
  });

  // Create a new bookmark under a board
  boardsController.post('/:id/bookmarks', onlyLoggedIn, (req, res) => {
	dataLoader.boardBelongsToUser(req.params.id, req.user.users_id)
	.then((r) => {
		if(!r) {
			res.json(Error)
		}
		dataLoader.createBookmark({
			ownerId: req.user.users_id,
			boardId: req.params.id,
			title: req.body.title,
			url: req.body.url
		})
	})
    .then(board => res.status(201).json(board))
    .catch(err => res.status(400).json(err));
  });

   boardsController.patch('/:id/bookmarks/:bookmarkId', onlyLoggedIn, (req, res) => {
      // First check if the board to be PATCHed belongs to the user making the request
  	console.log(req.user, 'wapwapwapwap')
      dataLoader.boardBelongsToUser(req.params.id, req.user.users_id)
      .then(() => {
        return dataLoader.updateBookmark(req.params.bookmarkId, {
          title: req.body.title,
		  url: req.body.url
        });
      })
      .then(data => {
		  console.log(data, 'this is data')
		  res.json(data)
	  })
      .catch(err => res.status(400).json(err));
    });

    // Delete an owned board
    boardsController.delete('/:id/bookmarks/:bookmarkId', onlyLoggedIn, (req, res) => {
      // First check if the board to be DELETEd belongs to the user making the request
      dataLoader.boardBelongsToUser(req.params.id, req.user.users_id)
      .then(() => {
        return dataLoader.deleteBookmark(req.params.bookmarkId);
      })
      .then(() => res.status(204).end())
      .catch(err => res.status(400).json(err));
    });

  return boardsController;
};
