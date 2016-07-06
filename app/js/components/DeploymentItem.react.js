import React, {Component} from 'react';
import {Card, CardTitle, CardActions, CardHeader, CardText, CardMedia} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import AppEngineCreators from '../actions/AppEngineCreators';

class DeploymentItem extends Component {
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

    console.error("Rendering DeploymentItem props is", this.props);
    var deployment = this.props.deployment
    var app = deployment.getApplication()
    console.log("Application is ", app)
    var imageElement = null
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
          title={deployment.meta.title}
          subtitle={app.title}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          {imageElement}
          <p>Deployment ID <tt>{deployment.id}</tt></p>
          <p>{app.descr}</p>
          <p>Price: {app.price} kr / mnd</p>
        </CardText>
        <CardActions expandable={true}>
          <RaisedButton label="Configure" primary={true} style={style} onMouseUp={this._actInstall} />
          <RaisedButton label="Remove" primary={true} style={style} onMouseUp={this._actInstall} />
        </CardActions>
      </Card>
    );
  }

  _actInstall(event, value) {
    // console.log("_actInstall");
    AppEngineCreators.deploySetup(this.props.app);
  }

}

export default DeploymentItem;
