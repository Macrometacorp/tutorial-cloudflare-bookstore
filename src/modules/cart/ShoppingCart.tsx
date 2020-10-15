import React, { Component } from "react";
import { CategoryNavBar } from "../category/categoryNavBar/CategoryNavBar";
import { SearchBar } from "../search/searchBar/SearchBar";
import "../../common/hero/hero.css";
import { CartProductRow, Order } from "./CartProductRow";
import "../../common/styles/common.css";
import { API } from "../../apiCalls";
import { Redirect } from "react-router";

interface ShoppingCartProps {}

interface ShoppingCartState {
  isLoading: boolean;
  orders: any[]; // FIXME
  orderTotal: number | undefined;
  toCheckout: boolean;
}

export default class ShoppingCart extends Component<
  ShoppingCartProps,
  ShoppingCartState
> {
  constructor(props: ShoppingCartProps) {
    super(props);

    this.state = {
      isLoading: true,
      orders: [],
      orderTotal: undefined,
      toCheckout: false,
    };
  }

  async componentDidMount() {
    try {
      const ordersInCart = await this.listOrdersInCart();
      this.setState({
        orders: ordersInCart,
      });
    } catch (e) {
      console.error(e);
    }

    this.getOrderTotal();
    this.setState({ isLoading: false });
  }

  listOrdersInCart() {
    return API.get("cart", "/cart", null);
  }

  getOrderTotal = async (shouldMakeCall: boolean = false) => {
    let ordersInCart = this.state.orders;

    if (shouldMakeCall) {
      ordersInCart = await this.listOrdersInCart();
      this.setState({
        orders: ordersInCart,
      });
    }

    let total = ordersInCart
      .reduce((total: number, orderObj: { order: Order }) => {
        const { order } = orderObj;
        return total + order.price * order.quantity;
      }, 0)
      .toFixed(2);

    this.setState({
      orderTotal: total,
    });
  };

  onCheckout = () => {
    this.setState({
      toCheckout: true,
    });
  };

  render() {
    if (this.state.toCheckout) return <Redirect to="/checkout" />;

    return this.state.isLoading ? (
      <div className="loader"></div>
    ) : (
      <div className="Category">
        <SearchBar />
        <CategoryNavBar />
        <div className="well-bs padding-bottom-120">
          <div className="white-box no-margin-top">
            <h3>Shopping cart</h3>
          </div>
          {this.state.orders.map((order) => (
            <CartProductRow
              order={order.order}
              book={order.book}
              key={order.order.bookId}
              calculateTotal={() => this.getOrderTotal(true)}
            />
          ))}
          <div className="pull-right checkout-padding">
            <button
              className="btn btn-black"
              type="button"
              disabled={this.state.orders.length < 1}
              onClick={this.onCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
        <div className="well-bs col-md-12 full-page"></div>
      </div>
    );
  }
}
