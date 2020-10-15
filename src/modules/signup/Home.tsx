import React, { Component } from "react";
import screenshot from "../../images/screenshot.png";
import yourpastorders from "../../images/yourpastorders.png";
import bestSellers from "../../images/bestSellers.png";
import yourshoppingcart from "../../images/yourshoppingcart.png";
import { Hero } from "../../common/hero/Hero";
import { CategoryNavBar } from "../category/categoryNavBar/CategoryNavBar";
import { SearchBar } from "../search/searchBar/SearchBar";
import { BestSellersBar } from "../bestSellers/bestSellersBar/BestSellersBar";
import { CategoryGalleryTeaser } from "../category/CategoryGalleryTeaser";
import { FriendsBought } from "../friends/FriendsBought";
import { LinkContainer } from "react-router-bootstrap";
import "./home.css";

interface HomeProps {
  isAuthenticated: boolean;
}

interface HomeState {
  isLoading: boolean;
}

export default class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    this.setState({ isLoading: true });
  }

  renderLanding() {
    return (
      <div className="lander">
        <h1>Edge Commerce Demo</h1>
        <hr />
        <p>This is an example application demonstrating Cloudflare Workers & Marcometa Data Infrastructure. It's an exact replication of the Amazon Web Services Amazon Book Store example application using Cloudflare and Macrometa. In this bookstore demo, users can browse and search for books, view recommendations, see the leaderboard, view past orders, and more. You can get this sample application up and running in your own environment and learn more about the architecture of the app by looking at the <a href="https://github.com/macrometacorp" target="_blank">github repository</a>.</p>
        <div className="button-container col-md-12">
          <LinkContainer to="/signup">
          <a href="/signup">Sign up to explore the demo</a>
          </LinkContainer>
        </div>
        <img src={screenshot} className="img-fluid full-width" alt="Screenshot"></img>
    </div>);
  }

  renderHome() {
    return (
      <div className="bookstore">
        <Hero />
        <SearchBar />
        <CategoryNavBar />
        <BestSellersBar />
        <div className="well-bs col-md-12 ad-container-padding">
          <div className="col-md-4 ad-padding">
            <div className="container-category no-padding">
              <LinkContainer to="/past">
                <img src={yourpastorders} alt="Past orders"></img>
              </LinkContainer>
            </div>
          </div>
          <div className="col-md-4 ad-padding">
            <div className="container-category no-padding">
              <LinkContainer to="/cart">
                <img src={yourshoppingcart} alt="Shopping cart"></img>
              </LinkContainer>
            </div>
          </div>
          <div className="col-md-4 ad-padding">
            <div className="container-category no-padding">
              <LinkContainer to="/best">
                <img src={bestSellers} alt="Best sellers"></img>
              </LinkContainer>
            </div>
          </div>
        </div>
        <CategoryGalleryTeaser />
        <FriendsBought />
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderHome() : this.renderLanding()}
      </div>
    );
  }
}