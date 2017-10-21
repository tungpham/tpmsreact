import React from 'react';
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  NavDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { createStructuredSelector } from 'reselect';
import { NavLink as Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeSelectUserProfile, makeSelectAuthenticated } from '../selectors/user';
import { loggedOut } from '../actions/user';
import Auth from '../auth/Auth';

export class Navigation extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.openDropDown = this.openDropDown.bind(this);
    this.logout = this.logout.bind(this);
  }

  openDropDown() {
    this.setState({ ...this.state, isOpen: !this.state.isOpen });
  }

  logout() {
    this.props.dispatch(loggedOut());
    Auth.logout();
    this.props.history.push('/login');
  }

  render() {
    return (
      <Navbar inverse toggleable light color="primary">
        {this.props.authenticated && <NavbarToggler right />}
        <NavbarBrand to="/" tag={Link}>MorePhone</NavbarBrand>
        {this.props.authenticated &&
        <Collapse isOpen={true} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink to="/dashboard" tag={Link} activeClassName="active">
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/usage" tag={Link} activeClassName="active">
                Usage
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/settings" tag={Link} activeClassName="active">
                Settings
              </NavLink>
            </NavItem>
          </Nav>
          <Nav navbar>
            <NavDropdown isOpen={this.state.isOpen} toggle={this.openDropDown}>
              <DropdownToggle nav>
                {this.props.profile.name}
                <img
                  src={this.props.profile.picture}
                  className="avatar rounded-circle"
                  alt="avatar"
                />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem to="/profile" tag={Link}>
                  Profile
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={this.logout}>Logout</DropdownItem>
              </DropdownMenu>
            </NavDropdown>
          </Nav>
        </Collapse>}
      </Navbar>
    )
  }
}


const mapStateToProps = createStructuredSelector({
  authenticated: makeSelectAuthenticated(),
  profile: makeSelectUserProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation));


