import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import './Header.css'

function Header() {

  return (
    <div className="Header">
      <img src="/assets/images/logo.png" alt="logo" className="Header__logo" />
      <div className="Header__search">
        <input type="text" className="Header__search--input" placeholder='Tìm kiếm...'/>
        <FontAwesomeIcon icon={faMagnifyingGlass} className="Header__search--icon"/>
      </div>
      <div className='Header__btn'>
        <button className="Header__btn--sign_in">Đăng nhập</button>
        <button className="Header__btn--sign_up">Đăng ký</button>
      </div>
    </div>
  );
}

export default Header;