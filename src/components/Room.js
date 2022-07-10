import React, {Component} from 'react';
import { Form, Label, Input, FormGroup, Row, Button } from 'reactstrap';
import { withRouter } from "../utility/withRouter";

class Room extends Component {
    constructor (props){
        super(props);

        this.state = {
            room: this.props.room?this.props.room:'Felwood'
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.setRoom(this.state.room);
    }
    
    render (){
        return (
            <div className='container mt-auto mb-auto'>
                <Row className='justify-content-center'>
                    <div className="col col-sm-4">
                        <Form className="bg-light card p-3" onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label className="text-start" htmlFor="username">Username: </Label>
                                <Input disabled type="text" name="username" value={this.props.username}></Input>
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="room">Room: </Label>
                                <Input onChange={this.handleChange} type="select" id="room" name="room" value={this.state.room}>
                                    <option value="Felwood">Felwood {this.props.room === "Felwood" ? "(Current Room)" : ""}</option>
                                    <option value="Lordaeron">Lordaeron {this.props.room === "Lordaeron" ? "(Current Room)" : ""}</option>
                                    <option value="Kalimdor">Kalimdor {this.props.room === "Kalimdor" ? "(Current Room)" : ""}</option>
                                    <option value="Dalaran">Dalaran {this.props.room === "Dalaran" ? "(Current Room)" : ""}</option>
                                    <option value="Ashenvale">Ashenvale {this.props.room === "Ashenvale" ? "(Current Room)" : ""}</option>
                                </Input>
                            </FormGroup>
                            <Button color="primary" type="submit">Join</Button>
                        </Form>
                    </div>
                </Row>
            </div>
        );
    }
}

export default withRouter(Room);