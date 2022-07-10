import React, {Component} from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';


class Leave extends Component {
    constructor (props){
        super (props);
        
        this.state = {
            isModalOpen: false
        }
    }

    toggleModal = () => {
        this.setState({isModalOpen: !this.state.isModalOpen});
    }

    render (){
        return (
            <>
                <Button type="button" color="danger" className="w-100" onClick={this.toggleModal}>Leave</Button>
                <Modal toggle={this.toggleModal} isOpen={this.state.isModalOpen}>
                    <ModalHeader toggle={this.toggleModal}>Confirmation</ModalHeader>
                    <ModalBody>Are you sure you want to leave this room?</ModalBody>
                    <ModalFooter>
                        <Button onClick={this.props.leaveRoom} color="primary">Yes</Button>
                        <Button onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

export default Leave;