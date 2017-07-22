import React from "react";
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
} from "reactstrap";
import { NavLink as Link } from "react-router-dom";
import { connect } from "react-redux";
import actions from "../actions";
import { compose, withState, withHandlers } from "recompose";
import { withRouter } from "react-router";

const Navigation = ({
  toggleNavigation,
  toggleProfile,
  authenticated,
  user,
  menuShown,
  isOpenProfile
}) => (
  <Navbar inverse toggleable light color="primary" className="fixed-top">
    {authenticated && <NavbarToggler right onClick={toggleNavigation} />}
    <NavbarBrand to="/" tag={Link}>MorePhone</NavbarBrand>
    {authenticated &&
      <Collapse isOpen={menuShown} navbar>
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
          <NavDropdown isOpen={isOpenProfile} toggle={toggleProfile}>
            <DropdownToggle nav>
              {user.get("name")}
              <img
                src={user.get("avatar")}
                className="avatar rounded-circle"
                alt="avatar"
              />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem to="/profile" tag={Link}>
                Profile
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Logout</DropdownItem>
            </DropdownMenu>
          </NavDropdown>
        </Nav>
      </Collapse>}
  </Navbar>
);

export const Component = Navigation;
export const enhance = compose(
  withState("isOpenProfile", "setIsOpenProfile", false),
  withHandlers({
    toggleProfile: ({ isOpenProfile, setIsOpenProfile }) => () =>
      setIsOpenProfile(!isOpenProfile)
  }),
  withRouter,
  connect(
    state => ({
      authenticated: state.user.authenticated,
      user: state.user.data,
      menuShown: state.app.menuShown
    }),
    {
      toggleNavigation: actions.app.toggleMenu
    }
  )
);

export default enhance(Component);
