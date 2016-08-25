import React from 'react';

import { Link } from 'react-router'

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
    var s = {
      color: "red !important" // cannot make this work #$%$#%
    }
    return (
      <div>
        <Drawer open={this.state.open} docked={true}>
          <Menu >
            <MenuItem primaryText="AppStore" href="/#/applications" value="library" leftIcon={<ShoppingBasket />} />
            <MenuItem primaryText="Running Apps"
              linkButton={true}
              containerElement={<Link activeStyle={s} to="/deployments" />}
              leftIcon={<Computer />} />
            <MenuItem primaryText="Billing"  leftIcon={<CreditCard />} />
            <MenuItem primaryText="UH-Sky" leftIcon={<Cloud />} />

            {/*<MenuItem linkButton={true} containerElement={<Link to="/deployments" />} primaryText="Foo" />*/}
          </Menu>
        </Drawer>
      </div>
    );
  }
}

// href="/#/deployments"
