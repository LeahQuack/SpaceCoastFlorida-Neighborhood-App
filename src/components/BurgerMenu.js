import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import './BurgerMenu.css';

class BurgerMenu extends Component {

  /*
   * openMarker function: is called with the onClick event
   * when a list item is clicked
  */
  // eslint-disable-next-line
  openMarker = locationName => {
    // eslint-disable-next-line
    this.props.markers.map(marker => {
      if (marker.title === locationName) {
        window.google.maps.event.trigger(marker, "click")
      }
    }, { passive: true })
  }


  render () {
    return (
      <Menu width={ '30%' } isOpen noOverlay >
        <div className="listOfVenues" aria-label="List of Venues">
        {this.props.venues.map(myVenue => (
            <li role="menuitem" onClick={() => {this.openMarker(myVenue.venue.name);}}
                aria-label={myVenue.venue.name}
                id={myVenue.venue.id}
                key={myVenue.venue.id}>
              <br/>
                <b>{myVenue.venue.name}</b>
              <br/>
            </li>
          ))}
          <p>
            <i>Data Courtesy of Foursquare API</i>
          </p>
          </div>
      </Menu>
    );
  }
}

export default BurgerMenu
