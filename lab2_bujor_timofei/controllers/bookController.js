const books = require('../models/bookModel');
const authors = require('../models/authorModel');

function getAllBooks(req, res) {
    const { genre, year } = req.query;
    let result = books;

    if (genre) {
        result = result.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
    }
    if (year) {
        result = result.filter(b => b.year === Number(year));
    }

    res.status(200).json(result);
}

function searchBooks(req, res) {
    const title = (req.query.title || '').toLowerCase();
    const result = books.filter(b => b.title.toLowerCase().includes(title));
    res.status(200).json(result);
}

// GET /api/books/:id
function getBookById(req, res) {
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(book);
}

function createBook(req, res) {
    const { title, authorId, genre, year } = req.body || {};

    if (!title || authorId === undefined || !genre || year === undefined) {
        return res.status(400).json({ error: 'Fields title, authorId, genre and year are required' });
    }

    const authorExists = authors.some(a => a.id === Number(authorId));
    if (!authorExists) {
        return res.status(400).json({ error: 'Author not found' });
    }

    const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
    const newBook = {
        id: newId,
        title,
        authorId: Number(authorId),
        genre,
        year: Number(year)
    };

    books.push(newBook);
    res.status(201).json(newBook);
}

function updateBook(req, res) {
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const { title, authorId, genre, year } = req.body || {};

    if (authorId !== undefined) {
        const authorExists = authors.some(a => a.id === Number(authorId));
        if (!authorExists) {
            return res.status(400).json({ error: 'Author not found' });
        }
        book.authorId = Number(authorId);
    }
    if (title !== undefined) book.title = title;
    if (genre !== undefined) book.genre = genre;
    if (year !== undefined) book.year = Number(year);

    res.status(200).json(book);
}

function deleteBook(req, res) {
    const id = Number(req.params.id);
    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const deleted = books.splice(index, 1)[0];
    res.status(200).json({ message: 'Book deleted', book: deleted });
}

function getStatistics(req, res) {
    const genres = new Set(books.map(b => b.genre));
    const sorted = [...books].sort((a, b) => a.year - b.year);

    res.status(200).json({
        booksCount: books.length,
        authorsCount: authors.length,
        genresCount: genres.size,
        newestBook: sorted[sorted.length - 1] || null,
        oldestBook: sorted[0] || null
    });
}

module.exports = {
    getAllBooks,
    searchBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getStatistics
};
