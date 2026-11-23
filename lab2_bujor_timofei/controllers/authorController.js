const authors = require('../models/authorModel');
const books = require('../models/bookModel');

// GET /api/authors
function getAllAuthors(req, res) {
    res.status(200).json(authors);
}

// GET /api/authors/:id
function getAuthorById(req, res) {
    const id = Number(req.params.id);
    const author = authors.find(a => a.id === id);

    if (!author) {
        return res.status(404).json({ error: 'Author not found' });
    }
    res.status(200).json(author);
}

// GET /api/authors/:id/books
function getAuthorBooks(req, res) {
    const id = Number(req.params.id);
    const author = authors.find(a => a.id === id);

    if (!author) {
        return res.status(404).json({ error: 'Author not found' });
    }

    const authorBooks = books.filter(b => b.authorId === id);
    res.status(200).json(authorBooks);
}

module.exports = { getAllAuthors, getAuthorById, getAuthorBooks };
