import React, { useState } from 'react';
import { Container, Row, Col, Form, Button} from 'react-bootstrap';
import ReactStars from "react-rating-stars-component";
import axios from 'axios';
import 'react-datetime/css/react-datetime.css';
import './FeedbackForm.css';
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos';
import { APP_ENV } from "../../configs/app_config";

const FeedbackForm = ({ event_id, event_name, feedbackable }) => {
  console.log(event_id, event_name, feedbackable);
  const [feedback, setFeedback] = React.useState(
    {
      "title": "",
      "content":"",
      "rating_score": 0,
      "event": event_id
    }
  )
  
  const [feedbacked, setFeedbacked] = React.useState(false);
  
  const [isFeedbackable, setIsFeedbackable ] = React.useState(feedbackable !== 'false' && feedbackable !== null );

  const [errors, setErrors] = React.useState({});
  const [supported, setSupported] = React.useState(false);

  const setRating = (newRating) =>{
    setFeedback((prev) => ({
      ...prev,
      rating_score: newRating,
    }))
  }

  const handleChange = (e) =>{
    let name = e.target.name;
    let value = e.target.value;
    setFeedback((prev)=>({
      ...prev,
      [name]: value,
    }))
  }
  
  const inputStyle = !isFeedbackable ? { pointerEvents: 'none' } : {};

  const handleSendFeedback = () =>{
      const newErrors = {};
      setErrors([]);
      if (!feedback.title) {
        newErrors["feedback_title"] = "Vấn đề không được trống";
      }
  
      if (!feedback.content) {
        newErrors["feedback_content"] = "Nội dung không được trống";
      }
  
      if (feedback.rating_score == 0) {
        newErrors["feedback_rating_score"] = "Đánh giá không được trống";
      }
  
      if (Object.keys(newErrors).length !== 0) {
        setErrors(newErrors);
        return;
      }
      else{
        axios.post(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/feedback`, {
          title: feedback.title,
          content: feedback.content,
          rating_score: feedback.rating_score,
          event: feedback.event,
        })
          .then(function (response) {
            if (response.data.status === 1) {
              setFeedbacked(true);
              setTimeout(() => {
                setFeedbacked(false);
              }, 1500);
              setIsFeedbackable(false);
            } else {
              setErrors((prevalue) => {
                return {
                  ...prevalue,
                  'feedback_error': response.data.message
                }
              });
            }
          })
      }
    }
  return (
    <Container>
      <h2 className='Feedback__event_name'>{event_name}</h2>
      <div className='Feedback__container'>
        <div className="Feedback__title">
          <label htmlFor="title" className='Feedback_form__label'>Vấn đề cần đánh giá</label>
          <input
            type="text"
            id="title"
            value={feedback.title}
            readOnly = {!isFeedbackable}
            disabled = {!isFeedbackable}
            name="title"
            placeholder='Vấn đề...'
            className={errors.feedback_title ? "Feedback_form__input error-input" : "Feedback_form__input normal-input"}
            onChange={(e) => handleChange(e)} 
            style={inputStyle}/>
          {errors["feedback_title"] && <span className="error">{errors["feedback_title"]}</span>}
        </div>
        <div className="Feedback__content">
          <label htmlFor="content" className='Feedback_form__label'>Nội dung đánh giá</label>
          <textarea
            type="text"
            id="content"
            value={feedback.content}
            readOnly = {!isFeedbackable}
            disabled = {!isFeedbackable}
            name="content"
            placeholder='Nội dung...'
            className={errors.feedback_content ? "Feedback_form__input error-input" : "Feedback_form__input normal-input"}
            onChange={(e) => handleChange(e)} 
            rows={4}
            cols={40}
            style={inputStyle}
          />
          {errors["feedback_content"] && <span className="error">{errors["feedback_content"]}</span>}
        </div>
        <div className='Feedback__rating_score' style={inputStyle}>
          <label className={errors.feedback_rating_score ? "Feedback_form__label error-label" : "Feedback_form__label"}>Đánh giá</label>
          <ReactStars
            name="rating"
            count={5}
            size={50}
            edit={isFeedbackable}
            value={feedback.rating_score}
            onChange={setRating}
          />
        </div>
        {errors["feedback_rating_score"] && <span className="error">{errors["feedback_rating_score"]}</span>}
        {feedbacked && <span className="successful">
          Đánh giá sự kiện thành công!
          </span>}
        <button className="Feedback--submit_btn" onClick={handleSendFeedback} disabled={!isFeedbackable} style={inputStyle}>
            Gửi đánh giá
        </button>
      </div>
    </Container>
  );
};

export default FeedbackForm;
