import React, { Component } from "react";
import screenshot from "../../images/screenshot.png";
import yourpastorders from "../../images/yourpastorders.png";
import bestSellers from "../../images/bestSellers.png";
import yourshoppingcart from "../../images/yourshoppingcart.png";
import Hero from "../../common/hero/Hero";
import { CategoryNavBar } from "../category/categoryNavBar/CategoryNavBar";
import { SearchBar } from "../search/searchBar/SearchBar";
import { BestSellersBar } from "../bestSellers/bestSellersBar/BestSellersBar";
import { CategoryGalleryTeaser } from "../category/CategoryGalleryTeaser";
import { FriendsBought } from "../friends/FriendsBought";
import { LinkContainer } from "react-router-bootstrap";
import "./home.css";
import { Auth } from "../../apiCalls";
import { Button, Glyphicon } from "react-bootstrap";

interface HomeProps {
  isAuthenticated: boolean;
  userHasAuthenticated: (authenticated: boolean) => void;
  showNetworkLatency: boolean;
}

interface HomeState {
  isLoading: boolean;
}

export default class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    this.setState({ isLoading: true });
  }

  onLogin = async (event: any) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    try {
      await Auth.signIn("guest@macrometa.io", "Abcd1234");

      this.setState({ isLoading: false }, () => {
        this.props.userHasAuthenticated(true);
      });
      // this.setState({ redirect: true });
    } catch (e) {
      console.error(e.message);
      this.setState({ isLoading: false });
    }
  };
  renderLanding() {
    return (
      <div className="lander">
        <hr />
        <p>
          This is an example app built with Cloudflare Workers & Marcometa
          Global Data Network. It's an exact replication of the Amazon Web
          Services Amazon Book Store example application using Cloudflare and
          Macrometa instead of AWS. It's entirely serverlesss and
          geo-distributed, which provides a lovely developer experience when
          building it and unparalleled performance. Learn more about the
          architecture of the app by checking out the source code in this{" "}
          <a
            href="https://github.com/Macrometacorp/tutorial-cloudflare-bookstore"
            target="_blank"
          >
            github repository
          </a>
          .
        </p>
        <div className="button-container col-md-12">
          <div style={{ marginLeft: "30%", marginRight: "30%" }}>
            <Button
              bsSize="large"
              type="button"
              onClick={(event: any) => {
                this.onLogin(event);
              }}
            >
              {this.state.isLoading && (
                <Glyphicon glyph="refresh" className="spinning" />
              )}
              Log in to shared guest account
            </Button>
          </div>
        </div>
        <img
          src={screenshot}
          className="img-fluid full-width"
          alt="Screenshot"
        ></img>
      </div>
    );
  }

  renderHome() {
    return (
      <div className="bookstore">
        <CategoryNavBar />
        <Hero showNetworkLatency={this.props.showNetworkLatency} />
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