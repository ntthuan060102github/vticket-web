import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';

import './Header.css'
import { useNavigate } from 'react-router-dom';

// Hàm kiểm tra token
const isAuthenticated = () => {
  const accessToken = localStorage.getItem('access');
  console.log(accessToken);
  // return true nếu có token
  return !!accessToken;
};

function Header() {
  const first_name = localStorage.getItem('first_name');
  const last_name = localStorage.getItem('last_name');
  const avatar_url = localStorage.getItem('avatar_url');

  const navigate = useNavigate();

  const handleLogout = () =>{
    navigate('/login');
    localStorage.clear();
  }

  return (
    <div className="Header">
      <img src="/assets/images/logo.png" alt="logo" className="Header__logo" />
      <div className="Header__search">
        <input type="text" className="Header__search--input" placeholder='Tìm kiếm...'/>
        <FontAwesomeIcon icon={faMagnifyingGlass} className="Header__search--icon"/>
      </div>
      {isAuthenticated === true ? 
      <div className='Header__btn'>
        <button className="Header__btn--sign_in">Đăng nhập</button>
        <button className="Header__btn--sign_up">Đăng ký</button>
      </div> :
      <div className="Header_user">
        <h2 className="user_name">{last_name} {first_name}</h2>
        <Dropdown className='user_action' autoClose="outside">
          <Dropdown.Toggle id="dropdown-basic">
            <img src={!avatar_url ? avatar_url : "/assets/images/avatar_default.png"} alt="User Avatar" className="user_avt"/>
          </Dropdown.Toggle>

          <Dropdown.Menu className='dropdow_menu'>
            <Dropdown.Item href="/profile">Thông tin cá nhân</Dropdown.Item>
            {/* <Dropdown.Item href="#/action-2">Another action</Dropdown.Item> */}
            <Dropdown.Item href="logout" onClick={handleLogout}>Đăng xuất</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>}
    </div>
  );
}

export default Header;