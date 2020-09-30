const queries = (queryName, bindValue) => {
  let queryObj
  switch (queryName) {
    case 'ListBooks':
      queryObj = { query: 'FOR book IN BooksTable RETURN book', bindVars: {} }
      if (typeof bindValue === 'object') {
        queryObj = {
          query:
            'FOR book IN BooksTable filter book.category == @category RETURN book',
          bindVars: bindValue,
        }
      }

      break
    case 'GetBook':
      queryObj = {
        query: 'FOR book in BooksTable FILTER book._key == @bookId RETURN book',
        bindVars: { bookId: bindValue },
      }
      break

    case 'ListItemsInCart':
      queryObj = { query: 'FOR item IN CartTable RETURN item', bindVars: {} }
      break
    case 'AddToCart':
      queryObj = {
        query:
          'INSERT {bookId: @bookId, quantity: @quantity, price: @price} INTO CartTable ',
        bindVars: {
          ...bindValue,
        },
      }
      break
    case 'UpdateCart':
      queryObj = { query: '', bindVars: {} }
      break
    case 'RemoveFromCart':
      queryObj = { query: '', bindVars: {} }
      break
    case 'GetCartItem':
      queryObj = { query: '', bindVars: {} }
      break

    case 'ListOrders':
      queryObj = { query: '', bindVars: {} }
      break
    case 'Checkout':
      queryObj = { query: '', bindVars: {} }
      break

    case 'GetBestSellers':
      queryObj = { query: '', bindVars: {} }
      break

    case 'GetRecommendations':
      queryObj = { query: '', bindVars: {} }
      break
    case 'GetRecommendationsByBook':
      queryObj = { query: '', bindVars: {} }
      break

    case 'Search':
      queryObj = { query: '', bindVars: {} }
      break
  }
  return queryObj
}

module.exports = { queries }
