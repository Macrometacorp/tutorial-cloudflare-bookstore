const queries = {
  LIST_BOOKS: function () {
    return 'FOR book IN BooksTable RETURN book'
  },
  // GET_BOOK: function(bookId) {
  //     return {'FOR book in BooksTable FILTER book.id == @bookId RETURN book'}
  // }
}

module.exports = { queries }
