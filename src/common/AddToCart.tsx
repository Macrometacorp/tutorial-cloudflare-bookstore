import React from "react";
import { API } from "../apiCalls";
import { Redirect } from "react-router";
import { Glyphicon } from "react-bootstrap";

interface AddToCartProps {
  bookId: string;
  price: number;
  variant?: string;
}

interface AddToCartState {
  loading: boolean;
  toCart: boolean;
  buttonText: string;
}

class AddToCart extends React.Component<AddToCartProps, AddToCartState> {
  constructor(props: AddToCartProps) {
    super(props);

    this.state = {
      loading: false,
      toCart: false,
      buttonText: `Add to cart`,
    };
  }

  onAddToCart = async () => {
    this.setState({ loading: true });
    // let bookInCart = await API.get("cart", `/cart/${this.props.bookId}`, null);
    // bookInCart = bookInCart[0];
    // if the book already exists in the cart, increase the quantity
    // if (bookInCart) {
    //   API.put("cart", "/cart", {
    //     body: {
    //       bookId: this.props.bookId,
    //       quantity: bookInCart.quantity + 1,
    //     },
    //   }).then(() => {
    //     alert("Item added successfully to the cart");
    //     // this.setState({
    //     //   toCart: true,
    //     // });
    //   });
    // }

    // if the book does not exist in the cart, add it
    // else {
    API.post("cart", "/cart", {
      body: {
        bookId: this.props.bookId,
        price: this.props.price,
        quantity: 1,
      },
    }).then(() => {
      this.setState({ loading: false, buttonText: "Added" });
      // alert("Item added successfully to the cart");
      // this.setState({
      //   toCart: true,
      // });
    });
  };
  // };

  getVariant = () => {
    let style = "btn btn-black";
    return this.props.variant && this.props.variant === "center"
      ? style + ` btn-black-center`
      : style + ` pull-right`;
  };

  render() {
    // if (this.state.toCart) return <Redirect to="/cart" />;

    return (
      <button
        className={this.getVariant()}
        disabled={this.state.loading}
        type="button"
        onClick={this.onAddToCart}
      >
        {this.state.loading && (
          <Glyphicon glyph="refresh" className="spinning" />
        )}
        {this.props.variant === "buyAgain"
          ? `Buy again`
          : this.state.buttonText}
      </button>
    );
  }
}

export default AddToCart;
