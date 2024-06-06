import * as React from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-regular-svg-icons';

// import style css
import './PaymentResult.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// import component
import Header from '../../components/Header';
import NavTopCus from '../../components/NavTopCus';
import Footer from '../../components/Footer';


function PaymentResult() {
  let { slug } = useParams();

  return (
    <div className="Payment_result">
      <Header/>
      <NavTopCus/>
      <div className="Payment_result__content--wrapper">
        <div className='Payment_result__content'>
          <FontAwesomeIcon icon={slug === "00" ? faCircleCheck : faCircleXmark} className={slug === "00" ? "icon_success" : "icon_fail"}/>
          {slug === "00" ? "Thanh toán thành công" : "Thanh toán thất bại"}
          <span className={slug === "00" ? 'Payment_result__content--epilogue successful' : 'Payment_result__content--epilogue failed'}>{slug === "00" ? "Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!" : "Có vẻ như đã xảy ra lỗi gì đó khi thanh toán, bạn hãy thanh toán lại nhé!"}</span>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default PaymentResult;