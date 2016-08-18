import React, {Component} from 'react';
import {Card, CardTitle, CardActions, CardHeader, CardText, CardMedia} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import ActionDelete from 'material-ui/svg-icons/action/delete-forever';
import RaisedButton from 'material-ui/RaisedButton';

import AppEngineCreators from '../actions/AppEngineCreators';

class DeploymentItem extends Component {
  constructor(props, context) {
    super(props, context);

    this._actDelete = this._actDelete.bind(this);
    this._actConfigure = this._actConfigure.bind(this);

    this.state = null;
  }

  // propTypes: {
  //   app: ReactPropTypes.object
  // },

  render() {

    const style = {
      margin: 12,
    };

    var deployment = this.props.deployment
    var app = deployment.getApplication()
    var imageElement = null
    if (app && app.thumbnail) {
      imageElement = (
        <CardMedia
        overlay={<CardTitle title={app.title} />}
        >
          <img src={app.thumbnail} />
        </CardMedia>
      );
    }

    if (app === null) {
      return (
        <Card>
          <CardHeader
            title={deployment.meta.title}
            subtitle={deployment.id}
            actAsExpander={true}
            showExpandableButton={true}
          />
        </Card>
      )
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
          <RaisedButton label="Configure (not impl)" primary={true} style={style} onMouseUp={this._actConfigure} />
          <RaisedButton label="Remove" secondary={true} style={style} onMouseUp={this._actDelete}
            icon={<ActionDelete  />}
            onMouseUp={this._actDelete}
            />
        </CardActions>
      </Card>
    );
  }

  _actDelete(event, value) {
    console.log("_actDelete", this.props.deployment.id);
    AppEngineCreators.deployDelete(this.props.deployment.id);
  }

  _actConfigure(event, value) {
    // console.log("_actConfigure");
    // AppEngineCreators.deploySetup(this.props.app);
  }

}

export default DeploymentItem;
