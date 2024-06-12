import React, { useState } from 'react';
import { Container, Row, Col, Form, Button} from 'react-bootstrap';
import axios from 'axios';
import 'react-datetime/css/react-datetime.css';
import './SupportForm.css';
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos';
import { APP_ENV } from "../../configs/app_config";

const SupportForm = ({ event }) => {
  const [supportRequest, setSupportRequest] = useState({
    "title": "",
    "content":"",
    "event": event.id,
  });
  const [errors, setErrors] = React.useState({});
  const [supported, setSupported] = React.useState(false);



  const handleChange = (e) =>{
    let name = e.target.name;
    let value = e.target.value;
    setSupportRequest((prev)=>({
      ...prev,
      [name]: value,
    }))
  }
  

  const handleSendSupport = () =>{
    const newErrors = {};
    setErrors([]);

    if(!supportRequest.title){
      newErrors["support_title"] = "Vấn đề không được để trống";
    }

    if(!supportRequest.content){
      newErrors["support_content"] = "Nội dung không được để trống";
    }

    if (Object.values(newErrors).length !== 0){
      setErrors(newErrors);
    }else {
      axios.post(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/support-request`, {
        title: supportRequest.title,
        content: supportRequest.content,
        event: supportRequest.event,
      })
        .then(function (response) {
          if (response.data.status === 1) {
            setSupported(true);
            setTimeout(() => {
              setSupported(false);
            }, 1500);
          } else {
            setErrors((prevalue) => {
              return {
                ...prevalue,
                'support_error': response.data.message
              }
            });
          }
        })
    }
  }

  return (
    <Container>
      <h2 className='Support_form__event_name'>{event.name}</h2>
      <div className='Support_form__container'>
        <div className="support__title">
          <label htmlFor="title" className='support_form__label'>Vấn đề cần hổ trợ</label>
          <input
            type="text"
            id="title"
            value={supportRequest.title}
            name="title"
            placeholder='Vấn đề...'
            className={errors.support_title ? "support_form__input error-input" : "support_form__input normal-input"}
            onChange={(e) => handleChange(e)} />
          {errors["support_title"] && <span className="error">{errors["support_title"]}</span>}
        </div>
        <div className="support__content">
          <label htmlFor="content" className='support_form__label'>Chi tiết</label>
          <textarea
            type="text"
            id="content"
            value={supportRequest.content}
            name="content"
            placeholder='Chi tiết...'
            className={errors.support_content ? "support_form__input error-input" : "support_form__input normal-input"}
            onChange={(e) => handleChange(e)} 
            rows={4}
            cols={40}
          />
          {errors["support_content"] && <span className="error">{errors["support_content"]}</span>}
        </div> 
        {supported && <span className="successful">
          Gửi yêu cầu hổ trợ thành công!
          </span>}
        <button className="Support--submit_btn" onClick={handleSendSupport}>
            Gửi yêu cầu hổ trợ
        </button>
      </div>
    </Container>
  );
};

export default SupportForm;
