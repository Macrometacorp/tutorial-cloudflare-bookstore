import React from "react";
import { API } from "../../apiCalls";

import AddToCart from "../../common/AddToCart";
import FriendRecommendations from "../../common/friendRecommendations/FriendRecommendations";
import StarRating from "../../common/starRating/StarRating";
import "../../common/styles/productRow.css";

interface ProductRowProps {
  bookId: string;
  book: Book;
}

export interface Book {
  _key: string;
  price: number;
  category: string;
  name: string;
  rating: number;
  author: string;
}

interface ProductRowState {
  book: Book | undefined;
}

export class ProductRow extends React.Component<
  ProductRowProps,
  ProductRowState
> {
  constructor(props: ProductRowProps) {
    super(props);

    this.state = {
      book: undefined,
    };
  }

  async componentDidMount() {
    try {
      // const book = await this.getBook();
      this.setState({ book: this.props.book });
    } catch (e) {
      console.error(e);
    }
  }

  getBook() {
    return API.get("books", `/books/${this.props.bookId}`, null);
  }

  render() {
    if (!this.state.book) return null;

    return (
      <div className="white-box">
        <div className="media">
          <div className="media-left media-middle no-padding">
            <img
              className="media-object product-thumb"
              src={`./api/getImage?bookId=${this.state.book["_key"]}`}
              alt={`${this.state.book.name} cover`}
            />
          </div>
          <div className="media-body product-padding padding-20">
            <h3 className="media-heading">
              {this.state.book.name}
              <small className="pull-right margin-1">
                <h4>${this.state.book.price}</h4>
              </small>
            </h3>
            <p>
              <small>{this.state.book.category}</small>
            </p>
            {/*ABHISHEK*/}
            {/* <FriendRecommendations bookId={this.props.bookId} /> */}
            <div>
              Rating
              <AddToCart
                bookId={this.props.bookId}
                price={this.state.book.price}
              />
            </div>
            <StarRating stars={this.state.book.rating} />
          </div>
        </div>
      </div>
    );
  }
}

export default ProductRow;
