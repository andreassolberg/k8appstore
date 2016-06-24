var React = require('react');

// var MessageSection = require('./MessageSection.react');
// var ThreadSection = require('./ThreadSection.react');
// 

var NavigationStore = require('../stores/NavigationStore');
var AppDirectory = require('./AppDirectory.react');
var Install = require('./Install.react');

var MuiThemeProvider = require('material-ui/styles/MuiThemeProvider');


console.log("MuiThemeProvider", MuiThemeProvider);

function getStateFromStores() {
  var navCurrent = NavigationStore.getCurrent();
  console.error("AppStore: Getting state from stores", navCurrent);
  return {
    nav: navCurrent,
    // thread: ThreadStore.getCurrent()
  };
}


var AppStore = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    NavigationStore.addChangeListener(this._onChange);
    // MessageStore.addChangeListener(this._onChange);
    // ThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() { 
    NavigationStore.removeChangeListener(this._onChange);
    // MessageStore.removeChangeListener(this._onChange);
    // ThreadStore.removeChangeListener(this._onChange);
  },
  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  _onChange: function() {
    console.log("Set state..");
    this.setState(getStateFromStores());
  },


  render: function() {


  	var mainElement = null;
    console.error("render", this.state);

  	// console.log("RENDER STATE", this.state);
  	if (this.state.nav === 'library') {
  		mainElement = <AppDirectory />;
  	}
  	if (this.state.nav === 'install') {
  		mainElement = <Install />;
  	}


    return (
      <MuiThemeProvider>
      <header>
        <div className="container">
          <a href="#" data-activates="nav-mobile" className="button-collapse top-nav waves-effect waves-light circle hide-on-large-only"><i className="material-icons">menu</i></a>
        </div>
        <ul id="nav-mobile" className="side-nav fixed">
          <li className="bold active"><a href="about.html" className="waves-effect waves-teal">App Store</a></li>
          <li className="bold"><a href="getting-started.html" className="waves-effect waves-teal">Running Apps</a></li>
          <li className="no-padding">
            <ul className="collapsible collapsible-accordion">
              <li className="bold"><a className="collapsible-header  waves-effect waves-teal">Billing</a>
                <div className="collapsible-body">
                  <ul>
                    <li><a href="">Color</a></li>
                    <li><a href="grid.html">Grid</a></li>
                    <li><a href="helpers.html">Helpers</a></li>
                  </ul>
                </div>
              </li>
            </ul>
          </li>
          <li className="bold"><a href="" className="waves-effect waves-teal">UH-Sky</a></li>
        </ul>
      </header>
      <main>
        {mainElement}

      </main>

      <footer className="page-footer">
        <div className="container">
          <div className="row">

            <div className="col l4 s12">
              <h5 className="white-text">Dataporten</h5>
              <p className="grey-text text-lighten-4">kontakt@uninett.no</p>
            
            </div>

            <div className="col l4 s12">
              <h5 className="white-text">Feide</h5>
              <p className="grey-text text-lighten-4">support@feide.no</p>
            </div>

            <div className="col l4 s12">
              <h5 className="white-text">RnD</h5>
              <p>iou@uninett.no</p>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            UNINETT © 2016
          <a className="grey-text text-lighten-4 right" href="https://github.com/Dogfalo/materialize/blob/master/LICENSE">MIT License</a>
          </div>
        </div>
      </footer>
      </MuiThemeProvider>
    );
  }

});

module.exports = AppStore;
