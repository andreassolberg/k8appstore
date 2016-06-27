import React, {Component} from 'react';
import {Card, CardTitle, CardActions, CardHeader, CardText, CardMedia} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';


import AppEngineCreators from '../actions/AppEngineCreators';

class AppDirectoryItem extends Component {
  constructor(props, context) {
    super(props, context);

    // this.handleRequestClose = this.handleRequestClose.bind(this);
    this._actInstall = this._actInstall.bind(this);

    this.state = null;
  }


  // propTypes: {
  //   app: ReactPropTypes.object
  // },

  render() {


    const style = {
      margin: 12,
    };

    // console.error("Rendering AppDirectoryItem props is", this.props);
    var app = this.props.app;
    var imageElement = null;
    if (app.thumbnail) {
      imageElement = (
        <CardMedia
        overlay={<CardTitle title={app.title} />}
        >
          <img src={app.thumbnail} />
        </CardMedia>
      );
    }

    return (
      <Card>
        <CardHeader
          title={app.title}
          subtitle={app.subtitle}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          {imageElement}
          <p>{app.descr}</p>
          <p>Price: {app.price} kr / mnd</p>
        </CardText>
        <CardActions expandable={true}>
          <RaisedButton label="Install" primary={true} style={style} onMouseUp={this._actInstall} />
          <FlatButton label="Demo" />
        </CardActions>
      </Card>
    );
  }

  _actInstall(event, value) {
    // console.log("_actInstall");
    AppEngineCreators.installApp(this.props.app);
  }

}

export default AppDirectoryItem;
