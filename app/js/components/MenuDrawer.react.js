import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';

export default class DrawerSimpleExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: true};
  }

  handleToggle() {
    this.setState({open: !this.state.open});
  }

  render() {
    return (
      <div>
        <Drawer open={this.state.open} docked={true}>
            <MenuItem primaryText="AppStore" leftIcon={<ContentInbox />} />
            <MenuItem primaryText="Running Apps" leftIcon={<ActionGrade />} />
            <MenuItem primaryText="Billing" leftIcon={<ContentSend />} />
            <MenuItem primaryText="UH-Sky" leftIcon={<ActionGrade />} />
        </Drawer>
      </div>
    );
  }
}