import React, { useRef, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import './NavTopCus.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos';
import { APP_ENV } from '../../configs/app_config';
import { Link } from 'react-router-dom';

function NavTopCus({eventTopics}) {

  // const [eventTopics, setEventTopics] =React.useState([]);

  // React.useEffect(() => {
  //   axios.get(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/event-topic`, {
  //   })
  //   .then(function (response) {
  //     if (response.data.status === 1) {
  //       setEventTopics(response.data.data);
  //     }
  //   })
  // }, []);

  return (
    <Navbar expand="lg" className="bg-body-tertiary Nav_top_cus">
      <Container className='Nav_top_cus__container'>
        {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <div className='nav_event_topic'>
              {eventTopics && eventTopics.map((eventTopic,index)=>{
                if(index <3){
                return(
                <Link key={index} to={`/events-for-topic/${eventTopic.id}?event_topic=${eventTopic?.name}`} className="link_to_event_for_topic">{eventTopic?.name}</Link>
              )}})};
            </div>
            <Dropdown className='nav_dropdown'>
              <Dropdown.Toggle id="dropdown-basic">
                Chọn địa điểm
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">TP. Hồ Chí Minh</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Hà Nội</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Đà Nẵng</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* <NavDropdown title="Chọn địa điểm" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">TP. Hồ Chí Minh</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Hà Nội
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Đà Nẵng</NavDropdown.Item>
              <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavTopCus;