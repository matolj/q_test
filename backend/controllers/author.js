const Book = require('../models/Book')

const deleteBookById = (id) =>{
    return Book.findByIdAndUpdate({ _id: id }, { isActive: false }, { new: true })
}

const updateBook = (id, book) => {
    return Book.findByIdAndUpdate({ _id: id },{
        name: book.name,
        content: book.content
    }, 
    { new: true })
}

const writeBook = (bodyBook, authorId) => {
    const book = new Book({
        name: bodyBook.name,
        content: bodyBook.content,
        author: authorId
    })

    return book.save()
}

module.exports = {
    deleteBookById,
    updateBook,
    writeBook
}

