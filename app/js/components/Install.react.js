var React = require('react');
var ReactPropTypes = React.PropTypes;

// var AppEngineCreators = require('../actions/AppEngineCreators');
// var AppNavicationCreators = require('../actions/AppEngineCreators');

var Install = React.createClass({

  propTypes: {
    app: ReactPropTypes.object
  },

  _actInstallStart: function() {
    console.log("Install start");
  },

  _actCancel: function() {
    console.log("Install cancel");
  },

  render: function() {
    var app = this.props.app;

    return (
      <div>
        <nav className="top-nav">
          <div className="container">
            <div className="nav-wrapper"><a className="page-title">Installing app </a></div>
          </div>
        </nav>
        <div className="container">
          <div className="row">
            <form className="col s12">

              <div className="row">
                <div className="input-field col s6">
                  <input id="first_name" type="text" className="validate" />
                  <label for="first_name">App name</label>
                </div>
                <div className="input-field col s6">
                  <input id="last_name" type="text" className="validate" />
                  <label for="last_name">Hostname</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s6">
                  <input id="first_name" type="text" className="validate" />
                  <label for="first_name">App name</label>
                </div>
                <div className="input-field col s6">
                  <input id="last_name" type="text" className="validate" />
                  <label for="last_name">Hostname</label>
                </div>
              </div>

              <div className="row">
                <p>Choose on which Cloud infrastructure platform to deploy the application:</p>
                <p>
                  <input type="checkbox" id="test5" />
                  <label for="test5">Red</label>
                </p>
                <p>
                  <input name="group1" type="radio" id="test1" />
                  <label for="test1">Sigma Cloud</label>
                </p>
                <p>
                  <input name="group1" type="radio" id="test2" />
                  <label for="test2">IPnett Cloud</label>
                </p>
                <p>
                  <input className="with-gap" name="group1" type="radio" id="test3"  />
                  <label for="test3">Google Container Engine</label>
                </p>
                <p>
                  <input name="group1" type="radio" id="test4" />
                  <label for="test4">UH-Intern Sky</label>
                </p>
                <p>
                  <input name="group1" type="radio" id="test5" disabled="disabled" />
                  <label for="test5">Brown</label>
                </p>
              </div>

              <div className="row section">
                <p>
                <button onClick={this._actInstallStart} className="btn waves-effect waves-light" type="submit" name="action">Install application
                  <i className="material-icons right">cloud</i>
                </button> &nbsp;
                <a onClick={this._actCancel}  className="waves-effect waves-teal btn-flat">Cancel</a>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    );
  }
})

;

module.exports = Install;
