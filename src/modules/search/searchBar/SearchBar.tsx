import React from "react";
import "./searchBar.css";
import { Redirect } from "react-router";

interface SearchBarProps {}

interface SearchBarState {
  redirect: string | undefined;
  value: string;
}

export class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);

    this.state = {
      redirect: undefined,
      value: "",
    };
  }

  handleChange = (event: React.ChangeEvent) => {
    const target = event.currentTarget as HTMLInputElement;
    this.setState({ value: target.value });
  };

  onSearch = () => {
    this.setState({
      redirect: `/search/${this.state.value}`,
    });
  };

  render() {
    return (
      <form className="searchform mainsearch">
        <div className="row">
          <div className="col-md-8 search-padding">
            <div className="input-group">
              <input
                type="text"
                className="form-control no-radius"
                id="txtSearch"
                placeholder="Search"
                value={this.state.value}
                onChange={this.handleChange}
                style={{ width: "6vw" }}
              />
              <div style={{ display: "flex", flexDirection: "row" }}>
                <button
                  className="btn btn-orange no-radius"
                  onClick={this.onSearch}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#ffffff",
                      fontWeight: "bold",
                    }}
                  >
                    Search
                  </div>
                </button>
              </div>

              {this.state.redirect && <Redirect to={this.state.redirect} />}
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default SearchBar;
