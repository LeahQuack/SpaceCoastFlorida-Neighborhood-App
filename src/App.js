import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import BurgerMenu from './components/BurgerMenu';
import ErrorBoundary from './components/ErrorBoundary';
import SearchBar from './components/SearchBar'

class App extends Component {
  /*This is my fifth startover attempt
THANK YOU to EPRIS and SARAH for their help! OMG*/
    state = {
      venues: [],
      markers: [],
      results: [],
      hideMarkers: [],
      query:''
    }

  //componentDidMount is used after something is put into the tree
  componentDidMount() {
    this.getVenues()
  }
//Loads the map script (thanks to the function at the very bottom) so we are able to initmap
  mapPrep = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyC8IQJcM-S_dqVfwGnMXhxY2tkps-U10nQ&callback=initMap")
    window.initMap = this.initMap;
  }
//I have put in three queries to direct folks to my favorite types of space coast searches.
//I upped the limit to 30 because a bunch of my favs were missing haha
  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const params = {
      client_id: "PJPNZXJTAQ0V3QJ0VOSQD4RDAKHAOH3YSFCOJGYIDUPLDPRY",
      client_secret: "YWKVJ4VEVZLOP3233E4QHZAKWRAS1B4YM1M202X4XHQWZTPM",
      query: "Patrick, Kennedy, Beach Park",
      ll: "28.354230,-80.725820",
      v: "20180323",
      limit: 30
    }

    axios.get(endPoint + new URLSearchParams(params))
      .then(response => {
        this.setState({
        venues: response.data.response.groups[0].items,
        results: response.data.response.groups[0].items.slice()
      }, this.mapPrep())
    })
      .catch(error => {
        console.log("ERROR " + error)
    });
  }

  //initialize the map, place the markers automatically when map loads with a DROP animation
  //I keep getting a warning that I need to make an event passive, but when I put passive : true, it doesnt fix it.
  //Loops through the venues and gives the InfoWindow the name, address, and city information.
  //When you click, it bounces (thank you Google Dev Notes) and times out.
  initMap = () => {

    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 28.354230,
                lng: -80.725820 },
      zoom: 10
    })

    const createInfoWindow = new window.google.maps.InfoWindow()

    this.state.venues.forEach(myVenue => {
      const infoString = `${myVenue.venue.name}  <br />  ${myVenue.venue.location.address}  <br />  ${myVenue.venue.location.city}`

      const marker = new window.google.maps.Marker({
        position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
        map: map,
        title: myVenue.venue.name,
        animation: window.google.maps.Animation.DROP,
      })

      this.state.markers.push(marker)

      let animationEffect = () => {
      marker.setAnimation(window.google.maps.Animation.BOUNCE)
      setTimeout(function(){ marker.setAnimation(null) }, 550)
    }

      let openInfoMarker = () => {
    createInfoWindow.setContent(infoString)
      animationEffect()
      createInfoWindow.open(map, marker)
    }

    marker.addListener('click', function() {
      openInfoMarker()
    }, { passive: true})
  }
)
}

  //Filter the SearchBar list/results
  // THANK YOU Project Coaches DOUG and JASON WHITE.  This Query STUMPED 
  updateQuery = query => {
    this.setState({ query });
    this.state.markers.map(marker => marker.setVisible(true));
    let hideMarkers;

    if (query) {
      const results = this.state.venues.filter(venue =>
        venue.venue.name.toLowerCase().includes(query.toLowerCase())
      );
      this.setState({
        results
      });

      hideMarkers = this.state.markers.filter(marker =>
        results.every(myVenue => myVenue.venue.name !== marker.title)
      );

      //Hide any markers that dont fit the query
      hideMarkers.forEach(marker => marker.setVisible(false));

      this.setState({ hideMarkers });
    } else {
      this.setState({ results: this.state.venues });
      this.state.markers.forEach(marker => marker.setVisible(true));
    }
  };

    render() {
   if (this.state.hasError) {
     return <div id="Error-message" aria-label="Error message">Error!</div>
   } else {
     return (
     <main>
       <ErrorBoundary>

       <div id="header" aria-label="Header">
       <h3>Leah's Favorite Space Coast Spots</h3>
       </div>

       <div id="SearchBar" aria-label="Search Bar">
         <SearchBar
           venues={ this.state.showVenues }
           markers={ this.state.markers }
           filteredVenues={ this.filteredVenues }
           query={this.state.query}
           updateQuery = {this.updateQuery}
          // clearQuery={this.clearQuery}
           //updateQuery={b => this.updateQuery(b)}
           clickLocation={this.clickLocation}
         />
       </div>

       <div id="container" aria-label="Menu Container">
         <BurgerMenu
           venues={ this.state.results }
           markers={ this.state.markers }
         />
       </div>

       <div id="map" aria-label="Map" role="application">
       </div>

       </ErrorBoundary>
     </main>
   );
 }
 }
}
  /*
  Credit: Elharony!
  Allows my map script above to render -- React does not recognize the <script> tags.
  Elharony took each individual piece of that script tag and broke it down to "translate" it to Vanilla JS so the React library can use it!
  */


  function loadScript(url) {
    let index  = window.document.getElementsByTagName("script")[0]
    let script = window.document.createElement("script")
    script.src = url
    script.async = true
    script.defer = true
    index.parentNode.insertBefore(script, index)
    script.onerror = function() {
      alert("Error loading map! Check the URL!");
    };
  }


  export default App;
