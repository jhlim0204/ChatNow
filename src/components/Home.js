import React from 'react';
import {Row, Col} from 'reactstrap';
import Cookies from 'js-cookie';
import {Link} from 'react-router-dom';

function Home (props) {
    if (Cookies.get("username")){
        return (
            <Row>
                <Col>
                    <div className="image-container">
                    <div className="centered">
                    <h1 className="display-4">Welcome back, {Cookies.get("username")}!</h1>
                    <p className="lead"><Link to="/room" className="text-light">Join a room</Link> to ChatNow!</p>
                    </div>
                    <img src="/assets/images/home1.jpg" className="img-fluid d-none d-sm-block" title="Using smartphone photo created by tirachardz - www.freepik.com/photos/using-smartphone"
                        alt="Using smartphone photo created by tirachardz - www.freepik.com/photos/using-smartphone"/>
                    <img src="/assets/images/home1_mobile.jpg" className="img-fluid d-block d-sm-none" title="Using smartphone photo created by tirachardz - www.freepik.com/photos/using-smartphone"
                        alt="Using smartphone photo created by tirachardz - www.freepik.com/photos/using-smartphone"/>
                    </div>
                </Col>
            </Row>
        );
    } else {
        return (
            <Row>
                <Col>
                    <div className="image-container">
                    <div className="centered">
                    <h1 className="display-4">Welcome to ChatNow!</h1>
                    <p className="lead">Login first to enjoy using this application!</p>
                    </div>
                    <img src="/assets/images/home2.jpg" className="img-fluid d-none d-sm-block" title="Asian study photo created by benzoix - www.freepik.com/photos/asian-study"
                        alt="Asian study photo created by benzoix - www.freepik.com/photos/asian-study"/>
                    <img src="/assets/images/home2_mobile.jpg" className="img-fluid d-block d-sm-none" title="Man smartphone photo created by katemangostar - www.freepik.com/photos/man-smartphone"
                        alt="Man smartphone photo created by katemangostar - www.freepik.com/photos/man-smartphone"/>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default Home;