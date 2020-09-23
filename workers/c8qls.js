const queries = (queryName, bindValue) => {
  let queryObj;
  switch(queryName){
    case "LIST_BOOKS":
      queryObj = { query: "FOR book IN BooksTable RETURN book", bindVars: {}}
      break;
    case "GET_BOOK":
      queryObj = {query: "FOR book in BooksTable FILTER book.id == @bookId RETURN book", bindVars: {"bookId": bindValue}}
      break;
  }
  return queryObj;
}

module.exports = { queries }
