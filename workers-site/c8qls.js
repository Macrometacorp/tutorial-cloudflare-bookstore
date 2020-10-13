const queries = (queryName, bindValue) => {
  let queryObj;
  switch (queryName) {
    case "signup":
      queryObj = {
        query: `INSERT {username: @username, password: @passwordHash, customerId: @customerId} INTO UsersTable`,
        bindVars: bindValue,
      };
      break;
    case "signin":
      queryObj = {
        query: `FOR user in UsersTable FILTER user.username == @username AND user.password == @passwordHash RETURN user.customerId`,
        bindVars: bindValue,
      };
      break;

    case "ListBooks":
      queryObj = { query: "FOR book IN BooksTable RETURN book", bindVars: {} };
      if (typeof bindValue === "object" && Object.keys(bindValue).length) {
        queryObj = {
          query:
            "FOR book IN BooksTable filter book.category == @category RETURN book",
          bindVars: bindValue,
        };
      }

      break;
    case "GetBook":
      queryObj = {
        query: "FOR book in BooksTable FILTER book._key == @bookId RETURN book",
        bindVars: { bookId: bindValue },
      };
      break;

    case "ListItemsInCart":
      queryObj = {
        query:
          "FOR item IN CartTable FILTER item.customerId == @customerId RETURN item",
        bindVars: bindValue,
      };
      break;
    case "AddToCart":
      queryObj = {
        query:
          'INSERT {_key: CONCAT_SEPARATOR(":", @customerId, @bookId),customerId: @customerId, bookId: @bookId, quantity: @quantity, price: @price} INTO CartTable ',
        bindVars: bindValue,
      };
      break;
    case "UpdateCart":
      queryObj = {
        query:
          'FOR item IN CartTable UPDATE {_key: CONCAT_SEPARATOR(":", @customerId, @bookId),quantity: @quantity} IN CartTable',
        bindVars: bindValue,
      };
      break;
    case "RemoveFromCart":
      queryObj = {
        query:
          'FOR item IN  CartTable REMOVE {_key: CONCAT_SEPARATOR(":", @customerId, @bookId)} IN CartTable',
        bindVars: bindValue,
      };
      break;
    case "GetCartItem":
      queryObj = {
        query:
          "FOR item IN CartTable FILTER item.customerId == @customerId AND item.bookId == @bookId RETURN item",
        bindVars: bindValue,
      };
      break;

    case "ListOrders":
      queryObj = {
        query:
          "FOR item IN OrdersTable FILTER item._key == @customerId RETURN item",
        bindVars: bindValue,
      };
      break;
    case "Checkout":
      queryObj = {
        query: `LET items = (FOR item IN CartTable FILTER item.customerId == @customerId RETURN item)
      FOR item IN items INSERT {_key: @customerId, books: items, orderId: @orderId, orderDate: @orderDate} INTO OrdersTable
      FOR itemToRemove IN items REMOVE {_key: itemToRemove._key} IN CartTable`,
        bindVars: bindValue,
      };
      break;

    case "GetBestSellers":
      queryObj = {
        query:
          "FOR book in BestsellersTable SORT book.quantity DESC LIMIT 20 return book._key",
        bindVars: {},
      };
      break;

    case "GetRecommendations":
      queryObj = { query: "", bindVars: {} };
      break;
    case "GetRecommendationsByBook":
      queryObj = { query: "", bindVars: {} };
      break;

    case "Search":
      queryObj = { query: "", bindVars: {} };
      break;
  }
  return queryObj;
};

module.exports = { queries };
