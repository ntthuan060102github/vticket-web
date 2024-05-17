import React, { useRef, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import './NavTopCus.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

function NavTopCus() {

  return (
    <Navbar expand="lg" className="bg-body-tertiary Nav_top_cus">
      <Container className='Nav_top_cus__container'>
        {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Vé ca nhạc</Nav.Link>
            <Nav.Link href="#link">Văn hóa nghệ thuật</Nav.Link>
            <Nav.Link href="#link">Tour</Nav.Link>
            <Nav.Link href="#link">Thể thao</Nav.Link>
            <Nav.Link href="#link">Vé máy bay / Khách sạn</Nav.Link>
            <Nav.Link href="#link">Vé xem phim</Nav.Link>
            <Nav.Link href="#link">Tin tức</Nav.Link>
            <Nav.Link href="#link">Video</Nav.Link>
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