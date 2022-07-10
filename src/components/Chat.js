import React, {Component} from 'react';
import {Form, FormGroup, Input, InputGroup, Button, Row, Col, Card, CardBody, CardTitle, CardText, Tooltip, ListGroup, ListGroupItem} from 'reactstrap';
import Leave from './LeaveComponent';
import { withRouter } from "../utility/withRouter";

function ChatMessage (props) {
    return (
        <Card className={'message ' + ((props.sender === props.selfName) ? 'self-message' : '')}>
            <CardBody>
                <CardTitle className="text-secondary">{props.sender} <span className='float-end'>&nbsp;&nbsp;&nbsp;&nbsp;{new Date(props.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></CardTitle>
                <CardText tag="h6">{props.message}</CardText>
            </CardBody>
        </Card>
    );
}


class Chat extends Component {
    constructor (props){
        super (props);

        this.state = {
            isTooltipOpen: false
        }
    }

    componentDidMount(){
        this.props.joinRoom();
    }

    componentDidUpdate(){
        if ((this.msgBox.scrollHeight - this.msgBox.clientHeight) <=  (this.msgBox.scrollTop+120)){
            this.msgBox.scrollTop = this.msgBox.scrollHeight;
        }
    }

    sendMessage = (event) => {
        event.preventDefault();
        const message = this.input.value;
        if (message === '' || /^\s+$/.test(message)){
            this.inputButton.blur();
            return;
        }
        this.input.value = '';
        this.props.sendMessage(message);
    }

    openTooltip = () => {
        this.setState({isTooltipOpen: !this.state.isTooltipOpen});
    }

    render () {
        const messages = this.props.messages.map( (mes, index) => 
            <ChatMessage key={index} message={mes.message} sender={mes.sender} time={mes.time} selfName={this.props.username}/>);
        const curRoomUserList = this.props.curRoomUserList.map( (user, index) => 
            <ListGroupItem key={index} action tag="button" className="user ps-1 ps-2 border-0"><span title={user} className="userText"><i className="bi bi-person-circle"></i> {user}</span></ListGroupItem>)
        return(
            <div className='container'>
                {/*fix layout for mobile*/}
                    <Row className='chatBox'>
                        <Col sm={2} className='d-none d-sm-flex'>
                            <Row className="flex-grow-1" style={{maxWidth: 100+'%'}}>
                                <Col xs={12} className="align-self-start">
                                    <span><i className="bi bi-chat"> </i>Room: <br/></span>
                                    <span className="h1 pt-1 pb-1 mt-2 text-center w-100 d-block rounded" style={{fontSize: 19+'px', backgroundColor: '#E3E4E6'}}>{this.props.curRoom}</span>
                                    <br/>
                                    <span><i className="bi bi-people"> </i>Users ({curRoomUserList.length})<br/></span>
                                    <ListGroup className="userList overflow-auto mt-1" style={{maxHeight: 378+'px'}}>{curRoomUserList}</ListGroup>
                                </Col>
                                <Col xs={12} className='mt-auto mb-3 text-center'>
                                    <Leave leaveRoom={this.props.leaveRoom}/>
                                </Col>
                            </Row>
                        </Col>

                        <Col sm={10}>
                            <Row>
                                <div ref={(ref)=>this.msgBox = ref} className="messageBox overflow-auto p-3 border border-1 rounded-3">
                                    {messages}
                                </div>
                            </Row>
                            <Row className="h-auto mt-2">
                                <Form className="ps-0 pe-0">
                                    <FormGroup>
                                        <InputGroup>
                                            <Input type="text" className="shadow-none" innerRef={(ref)=>this.input=ref} placeholder="Aa"/>
                                            <span id="emoji"><Button type="button" className="rounded-0" color="warning disabled"><i className="bi bi-emoji-smile"></i></Button></span>
                                            <Button type="submit" color="primary" onClick={(event)=>this.sendMessage(event)} innerRef={(ref)=>this.inputButton=ref}><i className="bi bi-send-fill"> </i>Send</Button>
                                        </InputGroup>
                                        <InputGroup className='d-block d-sm-none mt-2'>
                                            <Leave leaveRoom={this.props.leaveRoom}/>
                                        </InputGroup>
                                        <Tooltip flip isOpen={this.state.isTooltipOpen} placement="bottom" toggle={this.openTooltip} target="emoji">Coming soon!</Tooltip>
                                    </FormGroup>
                                </Form>
                            </Row>
                        </Col>
                    </Row>
            </div>
        );
    }
}

export default withRouter(Chat);