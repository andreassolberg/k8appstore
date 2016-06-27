import React from 'react';
import Drawer from 'material-ui/Drawer';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import ShoppingBasket from 'material-ui/svg-icons/action/shopping-cart';
import Computer from 'material-ui/svg-icons/hardware/computer';
import Apps from 'material-ui/svg-icons/navigation/apps';
import CreditCard from 'material-ui/svg-icons/action/credit-card';
import Cloud from 'material-ui/svg-icons/file/cloud';
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
          <Menu value="library">
            <MenuItem primaryText="AppStore" value="library" leftIcon={<ShoppingBasket />} />
            <MenuItem primaryText="Running Apps" leftIcon={<Computer />} />
            <MenuItem primaryText="Billing" leftIcon={<CreditCard />} />
            <MenuItem primaryText="UH-Sky" leftIcon={<Cloud />} />
          </Menu>
        </Drawer>
      </div>
    );
  }
}