import React, {Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Cookies from 'js-cookie';

class Logout extends Component {
    constructor (props) {
        super (props);

        this.state = {
            isModalOpen: false
        }
    }

    toggleModal = () => {
        this.setState({isModalOpen: !this.state.isModalOpen});
    }

    logout = () => {
        this.toggleModal();
        this.props.logOut();
    }

    render (){
        return (
            <>
                <Button outline type="button" color="light" className="w-100" onClick={this.toggleModal}><i className="bi bi-box-arrow-left"></i> Logout</Button>
                <Modal toggle={this.toggleModal} isOpen={this.state.isModalOpen}>
                    <ModalHeader toggle={this.toggleModal}>Log out</ModalHeader>
                    <ModalBody>Are you sure you want to log out, {Cookies.get("username")}?</ModalBody>
                    <ModalFooter>
                        <Button onClick={this.logout} color="primary">Yes</Button>
                        <Button onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

export default Logout;