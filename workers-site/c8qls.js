const queries = (queryName, bindValue) => {
  let queryObj;
  switch (queryName) {
    case "signup":
      queryObj = {
        query: `INSERT {_key: @username, password: @passwordHash, customerId: @customerId} INTO UsersTable`,
        bindVars: bindValue,
      };
      break;
    case "AddFriends":
      queryObj = {
        query: `LET otherUsers = (FOR users in UsersTable FILTER users._key != @username RETURN users)
        FOR user in otherUsers
            INSERT { _from: CONCAT("UsersTable/",@username), _to: CONCAT("UsersTable/",user._key)  } INTO friend`,
        bindVars: bindValue,
      };
      break;
    case "signin":
      queryObj = {
        query: `FOR user in UsersTable FILTER user._key == @username AND user.password == @passwordHash RETURN user.customerId`,
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
        // query:
        //   "FOR item IN CartTable FILTER item.customerId == @customerId RETURN item",
        query: `FOR item IN CartTable FILTER item.customerId == @customerId
        FOR book in BooksTable FILTER book._key == item.bookId
            RETURN {order: item, book: book}`,
        bindVars: bindValue,
      };
      break;
    case "AddToCart":
      queryObj = {
        query: `UPSERT { _key: CONCAT_SEPARATOR(":", @customerId, @bookId) } 
          INSERT { _key: CONCAT_SEPARATOR(":", @customerId, @bookId),customerId: @customerId, bookId: @bookId, quantity: @quantity, price: @price } 
          UPDATE { quantity: OLD.quantity + @quantity } IN CartTable`,
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
          'REMOVE {_key: CONCAT_SEPARATOR(":", @customerId, @bookId)} IN CartTable',
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
          "FOR item IN OrdersTable FILTER item.customerId == @customerId RETURN item",
        bindVars: bindValue,
      };
      break;
    case "Checkout":
      /* ABHISHEK: add edge from user to book once checked out */
      queryObj = {
        query: `LET items = (FOR item IN CartTable FILTER item.customerId == @customerId RETURN item)
        LET books = (FOR item in items
            FOR book in BooksTable FILTER book._key == item.bookId return book)
        INSERT {_key: @orderId, customerId: @customerId, books: books, orderDate: @orderDate} INTO OrdersTable
        FOR item IN items REMOVE item IN CartTable`,
        bindVars: bindValue,
      };
      break;
    case "AddPurchased":
      queryObj = {
        query: `LET order = first(FOR order in OrdersTable FILTER order._key == @orderId RETURN {customerId: order.customerId, books: order.books})
        LET customerId = order.customerId
        LET userId = first(FOR user IN UsersTable FILTER user.customerId == customerId RETURN user._id)
        LET books = order.books
        FOR book IN books
            INSERT {_from: userId, _to: book._id} INTO purchased`,
        bindVars: bindValue,
      };
      break;

    case "GetBestSellers":
      queryObj = {
        // query:
        //   "FOR book in BestsellersTable SORT book.quantity DESC LIMIT 20 return book._key",
        query: `FOR bestseller in BestsellersTable
        FOR book in BooksTable
            FILTER bestseller._key == book._key SORT bestseller.quantity DESC LIMIT 20 RETURN book`,
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
