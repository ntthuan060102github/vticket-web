import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';

import './Footer.css'
import { useNavigate } from 'react-router-dom';


function Footer() {

  return (
    <div className="Footer">
      <img src="/assets/images/logo.png" alt="logo" className="Footer__logo" />
      <span className='Footer__description'>VTicket là trang web đặt vé sự kiện trên toàn Việt Nam, cung cấp vé cho nhiều loại sự kiện như nhạc hội, gây quỹ từ thiện, ẩm thực, thể thao và nhiều hơn nữa, giúp bạn dễ dàng tham gia mọi hoạt động yêu thích.</span>
      <span className='Footer__license'>©2024 VTicket. All rights reserved.</span>
    </div>
  );
}

export default Footer;