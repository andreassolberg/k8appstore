var React = require('react');
var ReactPropTypes = React.PropTypes;

// var AppEngineCreators = require('../actions/AppEngineCreators');
var AppEngineCreators = require('../actions/AppEngineCreators');

var AppDirectoryItem = React.createClass({

  propTypes: {
    app: ReactPropTypes.object
  },

  render: function() {
    var app = this.props.app;


    var imageElement = null;
    if (app.thumbnail) {
      imageElement = (
          <div className="card-image waves-effect waves-block waves-light">
            <img className="activator" src={app.thumbnail} />
          </div>
      );
    }

    return (
      <div className="col s4">
        <div className="card">
          {imageElement}
          <div className="card-content">
            <span className="card-title activator grey-text text-darken-4">{app.title}<i className="material-icons right">more_vert</i></span>
            <p>{app.descr}</p>
            <p className="right-align">{app.price} kr / mnd</p>
          </div>
          <div className="card-action">
            <a href="#" onClick={this._actInstall}>Install</a>
            <a href="#">Demo</a>
          </div>
          <div className="card-reveal">
            <span className="card-title grey-text text-darken-4">{app.authorName}<i className="material-icons right">close</i></span>
            <p>{app.descr}</p>
          </div>
        </div>
      </div>
    );
  },

  _actInstall: function(event, value) {
    // console.log("_actInstall");
    AppEngineCreators.installApp(this.props.app);
  }

})

;

module.exports = AppDirectoryItem;
