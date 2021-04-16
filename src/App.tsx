import { Auth } from "./apiCalls";
import React, { Component, Fragment } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link, withRouter } from "react-router-dom";
import {
  ButtonToolbar,
  Form,
  Nav,
  Navbar,
  NavItem,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import "./App.css";
import { Routes } from "./Routes";

import bookstore from "./images/bookstore.png";
import SearchBar from "./modules/search/searchBar/SearchBar";

interface AppProps {
  history: any;
}

interface AppState {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  showNetworkLatency: boolean;
  showLatestNetworkLatencyValue: string;
}

class App extends Component<AppProps, AppState> {
  private performanceButton: React.RefObject<HTMLInputElement>;

  constructor(props: AppProps) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      showNetworkLatency: false,
      showLatestNetworkLatencyValue: "50 ms",
    };
    this.performanceButton = React.createRef();
    document.title = "Edge Commerce Demo";
  }

  async componentDidMount() {
    if (!sessionStorage.getItem("responseTime")) {
      sessionStorage.setItem("responseTime", JSON.stringify([]));
    }
    document.addEventListener("click", this.handleOutsideClick);
    try {
      if (await Auth.currentSession()) {
        this.userHasAuthenticated(true);
      }
    } catch (e) {
      if (e !== "No current user") {
        console.error(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }
  handleOutsideClick = (event: any) => {
    const closestParent = event.target.closest("#paper-id");

    const dropdownClosest = event.target.closest("#menu-");
    if (
      !event.target.id.includes("category-nav-bar") &&
      !closestParent &&
      event.target.tagName.toLowerCase() !== "body" &&
      !dropdownClosest &&
      this.performanceButton &&
      this.performanceButton.current &&
      !this.performanceButton.current.contains(event.target)
    ) {
      this.setState({ showNetworkLatency: false });
    }
  };
  componentWillUnmount() {
    window.removeEventListener("click", this.handleOutsideClick);
  }
  userHasAuthenticated = (authenticated: boolean) => {
    const networkLatency = JSON.parse(
      sessionStorage.getItem("responseTime") || "[]"
    );
    const networkLatencyValue =
      networkLatency &&
      networkLatency.length > 0 &&
      networkLatency[networkLatency.length - 1].Time;
    this.setState({
      isAuthenticated: authenticated,
      showLatestNetworkLatencyValue: networkLatencyValue,
    });
  };

  handleLogout = async () => {
    await Auth.signOut();

    this.userHasAuthenticated(false);
    this.props.history.push("/");
  };

  renderNetworkLatency = async () => {
    const networkLatency = JSON.parse(
      sessionStorage.getItem("responseTime") || "[]"
    );
    const networkLatencyValue =
      networkLatency &&
      networkLatency.length > 0 &&
      networkLatency[networkLatency.length - 1].Time;
    this.setState((prevState) => ({
      showNetworkLatency: !prevState.showNetworkLatency,
      showLatestNetworkLatencyValue: networkLatencyValue,
    }));
  };

  showLoggedInBar = () => (
    <Fragment>
      <Navbar.Form pullLeft>
        <SearchBar />
      </Navbar.Form>
      <LinkContainer to="/past">
        <NavItem>
          <span
            className="orange line-height-24 navbar-items-font-style"
            style={{ fontWeight: "initial" }}
          >
            Past orders
          </span>
        </NavItem>
      </LinkContainer>
      <LinkContainer to="/best">
        <NavItem>
          <span
            className="orange line-height-24 navbar-items-font-style"
            style={{ fontWeight: "initial" }}
          >
            Bestsellers
          </span>
        </NavItem>
      </LinkContainer>
      <NavItem onClick={this.handleLogout}>
        <span
          className="orange line-height-24 navbar-items-font-style"
          style={{ fontWeight: "initial" }}
        >
          Log out
        </span>
      </NavItem>
      <LinkContainer to="/cart">
        <NavItem>
          <div className="shopping-icon-container">
            <span
              className="glyphicon glyphicon-shopping-cart white"
              aria-hidden="true"
            ></span>
          </div>
        </NavItem>
      </LinkContainer>
    </Fragment>
  );

  showLoggedOutBar = () => (
    <Fragment>
      <LinkContainer to="/login">
        <NavItem>
          <span
            className="orange  navbar-items-font-style"
            style={{ fontWeight: "initial" }}
          >
            Log in
          </span>
        </NavItem>
      </LinkContainer>
    </Fragment>
  );

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      showNetworkLatency: this.state.showNetworkLatency,
    };

    return (
      !this.state.isAuthenticating && (
        <div className="App container">
          <Navbar
            fluid
            collapseOnSelect
            style={{
              paddingBottom: "40px",
              paddingLeft: "5px",
              paddingRight: "5px",
              width: "auto",
            }}
          >
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">
                  <span className="orange" style={{ fontSize: "19px" }}>
                    <img src={bookstore} alt="bookstore" /> EDGE COMMERCE DEMO
                  </span>
                </Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            {this.state.isAuthenticated ? (
              <>
                <Navbar.Text style={{ marginTop: "10px" }}>
                  <button
                    className="btn btn-orange no-radius"
                    onClick={this.renderNetworkLatency}
                    style={{ marginRight: "5px" }}
                  >
                    <div
                      style={{
                        fontSize: "16px",
                        color: "#ffffff",
                        fontWeight: "bold",
                      }}
                      ref={this.performanceButton}
                    >
                      View Latency Stats
                    </div>
                  </button>
                  {/* <span
                    className="navbar-items-font-style"
                    style={{ marginLeft: "3vw", fontSize: "24px" }}
                  >
                    Latency :
                  </span>
                  <span
                    className="input navbar-items-font-style"
                    role="textbox"
                    style={{ fontSize: "24px" }}
                  >
                    {this.state.showLatestNetworkLatencyValue}
                  </span> */}
                </Navbar.Text>
              </>
            ) : null}
            <Navbar.Collapse>
              <Nav pullRight style={{ paddingTop: "2px" }}>
                {this.state.isAuthenticated
                  ? this.showLoggedInBar()
                  : this.showLoggedOutBar()}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes
            isAuthenticated={childProps.isAuthenticated}
            userHasAuthenticated={childProps.userHasAuthenticated}
            showNetworkLatency={childProps.showNetworkLatency}
          />
        </div>
      )
    );
  }
}

export default withRouter(App as any);
