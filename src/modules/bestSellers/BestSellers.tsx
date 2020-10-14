import React from "react";
import { API } from "../../apiCalls";

import BestSellerProductRow from "./BestSellerProductRow";
import { CategoryNavBar } from "../category/categoryNavBar/CategoryNavBar";
import { SearchBar } from "../search/searchBar/SearchBar";

interface BestSellersProps {}

interface BestSellersState {
  isLoading: boolean;
  // books: { bookId: any }[];
  books: {
    _key: string;
    author: string;
    name: string;
    price: number;
    rating: number;
    category: string;
  }[];
}

export default class BestSellers extends React.Component<
  BestSellersProps,
  BestSellersState
> {
  constructor(props: BestSellersProps) {
    super(props);

    this.state = {
      isLoading: true,
      books: [],
    };
  }

  async componentDidMount() {
    try {
      const books = [];
      const bestSellers = await API.get("bestsellers", "/bestsellers", null);

      // Map the elasticache results to a book object
      for (var i = 0; i < bestSellers.length; i++) {
        // const bookId = bestSellers[i];
        // books.push({ bookId });
        const book = bestSellers[i];
        books.push(book);
      }
      this.setState({
        books: books,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <div className="Category">
        <SearchBar />
        <CategoryNavBar />
        <div>
          <div className="well-bs no-radius">
            <div className="container-category">
              <h3>Top 20 best sellers</h3>
            </div>
            {this.state.isLoading ? (
              <div className="loader" />
            ) : (
              this.state.books
                .slice(0, 20)
                .map((book) => (
                  <BestSellerProductRow
                    bookId={book["_key"]}
                    book={book}
                    key={book["_key"]}
                  />
                ))
            )}
          </div>
        </div>
      </div>
    );
  }
}
