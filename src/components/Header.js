import React, {Component} from 'react';
import {Navbar, Nav, NavItem, NavbarBrand, NavbarToggler, Collapse} from 'reactstrap';
import {NavLink} from 'react-router-dom';
import Login from './Login';
import Logout from './Logout';
import { withRouter } from "../utility/withRouter";

class Header extends Component {
    constructor(props){
        super(props);

        this.state = {
            isNavbarOpen: false
        }
    }

    toggleNavbar = () => {
        this.setState({isNavbarOpen: !this.state.isNavbarOpen});
    }

    render(){
        return(
            <Navbar className="fixed-top navbar-dark" dark expand="sm">
                <NavbarToggler onClick={this.toggleNavbar} />
                <NavbarBrand tag={NavLink} className="d-none d-sm-block" to="/home">
                    <img src="/assets/images/logo.png" alt="logo" height="23"/>
                </NavbarBrand>
                <Nav className='ms-auto d-block d-sm-none'>
                    <NavItem className='text-light'>
                        {this.props.room && (this.props.location.pathname === '/chat')? this.props.room : ""}
                    </NavItem>
                </Nav>
                <Nav className='ms-auto d-block d-sm-none'>
                    <NavItem>
                        {this.props.username ? <Logout logOut={this.props.logOut}/> : <Login updateStatus={this.props.updateStatus}/>}
                    </NavItem>
                </Nav>
                <Collapse navbar isOpen={this.state.isNavbarOpen}>
                    <Nav navbar>
                        <NavItem>
                            <NavLink className="nav-link" to="/home">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={"nav-link " + (this.props.username?"":"disabled")} to="/room">Room</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={"nav-link " + (this.props.username && this.props.room?"":"disabled")} to={`/chat`}>Chat</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
                <Nav className='ms-auto pe-4 d-none d-sm-block'>
                    <NavItem>
                        {this.props.username ? <Logout logOut={this.props.logOut}/> : <Login updateStatus={this.props.updateStatus}/>}
                    </NavItem>
                </Nav>
            </Navbar>
        );
    }
}

export default withRouter(Header);