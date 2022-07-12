import React, {Component} from 'react';
import { Col, Form, Label, Input, FormGroup, FormFeedback, Row, Button, Modal, ModalHeader, ModalBody, Nav, NavItem, NavLink, TabContent, TabPane  } from 'reactstrap';
import Register from './Register';
import Cookies from 'js-cookie';

class Login extends Component {
    constructor (props) {
        super (props);

        this.state = {
            username: '',
            password: '',
            isLoading: false,
            isModalOpen: false,
            invalidUsername: false,
            invalidPassword: false,
            currentActiveTab: "login"
        }
    }

    handleInput = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const user = {username: this.state.username, password: this.state.password}
        this.setState({isLoading: true, invalidPassword: false, invalidUsername: false,});
        fetch('/loginuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user),
                credentials: 'same-origin'
            })
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                    throw error;
                }   
            })
            .then(data => {
                if (Cookies.get('username')){
                    alert (Cookies.get('username')+', you have previously logged in before.');
                    this.setState({
                        isLoading: false
                    })
                }
                else if (!data.username){
                    this.setState({
                        invalidUsername: true,
                        isLoading: false
                    })
                } else if (!data.password){
                    this.setState({
                        invalidPassword: true,
                        isLoading: false
                    })
                } else {
                    this.setState({
                        username: '',
                        password: '',
                        isLoading: false
                    });
                    alert("Logged in successfully");
                    Cookies.set('username', user.username, { expires: 7 });
                    this.props.updateStatus();
                }
            })
            .catch(error => {
                alert(`An error has occured, message: ${error.message}`);
            });
    }

    toggleModal = () => {
        this.setState({isModalOpen: !this.state.isModalOpen});
    }

    toggleTab = tab => {
        if (this.state.currentActiveTab !== tab) {
            this.setState({currentActiveTab: tab});
        }
    }

    render (){
        return (
            <>
            <Button outline type="button" color="light" className="w-100" onClick={this.toggleModal}><i className="bi bi-box-arrow-in-right"> </i>Login</Button>
            <Modal toggle={this.toggleModal} isOpen={this.state.isModalOpen}>
                <ModalHeader toggle={this.toggleModal} className="mb-0 pt-2 pb-0 border-0">
                    <Nav tabs>
                        <NavItem>
                        <NavLink role="button"
                            className={this.state.currentActiveTab === 'login' ? "active fw-bold" : "text-muted"}
                            onClick={() => { this.toggleTab('login'); }}
                        >
                            Log In
                        </NavLink>
                        </NavItem>
                        <NavItem>
                        <NavLink role="button"
                            className={this.state.currentActiveTab === 'register' ? "active fw-bold" : "text-muted"}
                            onClick={() => { this.toggleTab('register'); }}
                        >
                            Register
                        </NavLink>
                        </NavItem>
                    </Nav>
                </ModalHeader>
                <div className="line"></div>
                <ModalBody className="pt-4 pb-2 bg-light">
                    <TabContent activeTab={this.state.currentActiveTab}>
                        <TabPane tabId="login">
                            <Row className='justify-content-sm-center'>
                                <Col sm={11}>
                                    <Form id="loginForm" onSubmit={this.handleSubmit}>
                                        <FormGroup>
                                            <Label className="text-start" htmlFor="username">Username: </Label>
                                            <Input type="text" name="username" value={this.state.username} onChange={this.handleInput} invalid={this.state.invalidUsername} 
                                                autoComplete="off" spellCheck="false"></Input>
                                            <FormFeedback>
                                                Username not found.
                                            </FormFeedback>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label htmlFor="password">Password: </Label>
                                            <Input type="password" name="password" value={this.state.password} invalid={this.state.invalidPassword} 
                                                onChange={this.handleInput}></Input>
                                            <FormFeedback>
                                                The password that you've entered is incorrect.
                                            </FormFeedback>
                                        </FormGroup>
                                        <FormGroup className="float-end mt-2">
                                            <Button className="me-2" form="loginForm" type="submit" color="primary" disabled={this.state.isLoading}>
                                                <div className={this.state.isLoading?"d-inline":"d-none"}><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></div> Login
                                            </Button>
                                            <Button onClick={this.toggleModal}>Cancel</Button>
                                        </FormGroup>
                                    </Form>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="register">
                            <Register toggleModal={this.toggleModal} switchTab={() => { this.toggleTab('login'); }}/>
                        </TabPane>
                    </TabContent>
                </ModalBody>
            </Modal>
            </>
        );
    }
}

export default Login;