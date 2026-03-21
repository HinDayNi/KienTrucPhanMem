const express = require('express');
const Library = require('../library/Library');

const router = express.Router();
const library = Library.getInstance();

function handleError(res, error) {
  return res.status(400).json({ message: error.message });
}

router.get('/books', (req, res) => {
  return res.json(library.listBooks());
});

router.post('/books', (req, res) => {
  try {
    const book = library.addBook(req.body);
    return res.status(201).json(book);
  } catch (error) {
    return handleError(res, error);
  }
});

router.get('/search', (req, res) => {
  const by = req.query.by || 'title';
  const q = req.query.q || '';
  return res.json(library.searchBooks(by, q));
});

router.post('/borrow', (req, res) => {
  try {
    const loan = library.borrowBook(req.body);
    return res.status(201).json(loan);
  } catch (error) {
    return handleError(res, error);
  }
});

router.post('/return', (req, res) => {
  try {
    const loan = library.returnBook(req.body.loanId);
    return res.json(loan);
  } catch (error) {
    return handleError(res, error);
  }
});

router.get('/loans', (req, res) => {
  return res.json(library.listLoans());
});

router.post('/observers', (req, res) => {
  try {
    const data = library.registerObserver(req.body.name, req.body.role);
    return res.status(201).json(data);
  } catch (error) {
    return handleError(res, error);
  }
});

router.get('/observers', (req, res) => {
  return res.json(library.listObservers());
});

router.post('/overdue/check', (req, res) => {
  return res.json(library.checkOverdue());
});

router.get('/notifications', (req, res) => {
  return res.json(library.listNotifications());
});

module.exports = router;
