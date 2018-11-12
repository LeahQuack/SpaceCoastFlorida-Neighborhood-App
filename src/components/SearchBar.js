import React, { Component } from 'react'

class SearchBar extends Component {
//this is just all wrong and I dont even know.
  render() {
      return (
        <div className="locationsFilter" role="application">
          <input
          type="text"
          autoFocus
          id="query-Filter"
          placeholder="Location Search"
          aria-label="Locations filter"
          value={this.props.query}
          onChange={event => this.props.updateQuery(event.target.value)}
          />
        </div>
      );
    }
}


export default SearchBar;
