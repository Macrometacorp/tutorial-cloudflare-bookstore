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
          Welcome to the Edge Commerce Bookstore example app built entirely with
          Cloudflare Workers & Marcometa Global Data Network. It's entirely
          serverless and geo-distributed, which provides a lovely developer
          experience when building it and unparalleled performance.
        </p>
        <p>
          Creating a new user account to access the app will give you the full
          'shopping' experience. If you don't want to take the time to sign up,
          you can access a shared demo account with a single click below (more
          than one person may be logged into the shared account at once, so you
          might see some unexpected behavior).
        </p>
        <p>
          Learn more about the architecture of the app by checking out the
          source code in this{" "}
          <a
            href="https://github.com/Macrometacorp/tutorial-cloudflare-bookstore"
            target="_blank"
          >
            github repository
          </a>
          .
        </p>
        <div className="button-container col-md-12">
          <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
            <LinkContainer to="/signup">
              <a href="/signup">Create an Edge Commerce Demo Account</a>
            </LinkContainer>
          </div>
          <div style={{ marginLeft: "30%", marginRight: "30%" }}>
            <p
              onClick={(event: any) => {
                this.onLogin(event);
              }}
              className="link-click"
              style={{
                color: "#2eadde",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {this.state.isLoading && (
                <Glyphicon glyph="refresh" className="spinning" />
              )}
              Log in to shared guest account
            </p>
          </div>
        </div>
        <figure>
          <img
            src={screenshot}
            className="img-fluid full-width screenshot-shadow img-center"
            alt="Screenshot"
          ></img>

          <figcaption style={{ paddingTop: "2px" }}>
            <p style={{ fontSize: "15px" }}>
              This example app is an exact replica of the Amazon Web Services{" "}
              <a href="https://d2h3ljlsmzojxz.cloudfront.net/" target="_blank">
                Amazon Book Store example app
              </a>{" "}
              using Cloudflare and Macrometa instead of AWS.
            </p>
          </figcaption>
        </figure>
        <footer
          style={{
            height: "auto",
            backgroundColor: "#3d3cb1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",

            marginTop: "100px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: "10px",
                paddingTop: "40px",
              }}
            >
              <h4
                style={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Get started using Macrometa
              </h4>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: "40px",
              }}
            >
              <form
                action="https://cloudflare.paas.macrometa.io/signup"
                method="get"
                target="_blank"
              >
                <Button type="submit">
                  {this.state.isLoading && (
                    <Glyphicon glyph="refresh" className="spinning" />
                  )}
                  Sign up for FREE a Developer Account
                </Button>
              </form>
            </div>
          </div>
        </footer>
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
