import * as React from "react";
import { Link} from "react-router-dom";
import axios from 'axios';

import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"

import './Login.css'

// interface Account {
//     username: string;
//     password: string;
// }

function Login() {

    const  [accountInfo, setAccountInfo] = React.useState({username:"",password:""});
    const [error, setError] = React.useState("");

    const handleChange = (event) =>{
        let value = event.target.value;
        let name = event.target.name;
 
        setAccountInfo((prevalue) => {
            return {
                ...prevalue,   // Spread Operator               
                [name]: value
            }
        })
    }

    const handleSubmit = () =>{
        axios.post(`${VTICKET_API_SERVICE_INFOS.account[APP_ENV].domain}/token`, {
            email: accountInfo.username,
            password: accountInfo.password,
          })
          .then(function (response) {
            console.log(response);
            window.location.href = '/'; 
          })
          .catch(function (error) {
            setError(error.message);
          });
    }
    return (
        <div className="Login__wrapper">
            <img src="/assets/images/poster_login.png" alt="poster" className="Login__poster" />
            <div className='Login'>
                <img src="/assets/images/logo.png" alt="logo" className="Login__logo" />
                <div className="Login__nav">
                    <Link to={'/login'} className="Login__nav--signin_btn active">Đăng nhập</Link>
                    <Link to={'/signup'} className="Login__nav--signup_btn">Đăng ký</Link>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className='Login__form'>
                    <label htmlFor="username" className='form__label'>Tài khoản</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username"
                        value={accountInfo.username}
                        onChange={handleChange}
                        placeholder='Nhập tài khoản' 
                        className='form__input' />
                    <label htmlFor="password" className='form__label'>Mật khẩu</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        value={accountInfo.password}
                        onChange={handleChange}
                        placeholder='Nhập mật khẩu' 
                        className='form__input' />
                    <Link to={'/forgot_password'} className="Login__form--forgot">Quên mật khẩu?</Link>
                    {error != "" && <span className="error">{error}</span>}
                    <button className='Login__form--submit_btn' type="submit">Đăng nhập</button>
                </form>
            </div>
        </div>
    );
}

export default Login;