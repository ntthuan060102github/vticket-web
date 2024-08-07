import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCalendarDays, faClock, faEye, faHandHoldingDollar, faHeadset, faLocationDot, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import ReactStars from "react-rating-stars-component";
import TicketSelectionForm from '../../components/TicketSelectionForm';
import { Swiper, SwiperSlide } from 'swiper/react';
import "chart.js/auto";
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SwiperCore from 'swiper';
import { Autoplay, EffectCards } from 'swiper/modules';
import './EventDetail.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos';
import { APP_ENV } from "../../configs/app_config";
import Header from '../../components/Header';
import NavTopCus from '../../components/NavTopCus';
import axios from 'axios';
import Footer from '../../components/Footer';
import { Link, useParams } from 'react-router-dom';
import SupportForm from '../../components/SupportForm';

SwiperCore.use([EffectCards]);

function EventDetail() {
  let { id } = useParams();
  const role = localStorage.getItem('role');
  const [errors, setErrors] = React.useState([]);
  const [orgInfo, setOrgInfo] = React.useState([]);
  const [relatedEvents, setRelatedEvents] = React.useState([]);
  const [eventDetail, setEventDetail] = React.useState({
    "id": "",
    "ticket_types": [],
    "event_topics": [],
    "name": "",
    "description": "",
    "start_date": "",
    "end_date": "",
    "start_time": "",
    "location": "",
    "banner_url": ""
  });
  
  const [feedbackReply, setFeedbackReply] = React.useState({
    "content": "",
    "feedback": "",
  });

  const [isAPIResponsed, setIsAPIResponsed ] = React.useState(eventDetail.id !== '');
  const [feedbacks, setFeedbacks] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [showModalSupport, setShowModalSupport] = React.useState(false);
  const [showReplyForFeedbackId, setShowReplyForFeedbackId] = React.useState(null);
  const [isReplied, setIsReplied] = React.useState(false);
  const [feedbackReplied, setFeedbackReplied] = React.useState(false);

  const handleShow = () => setShowModal(true);
  const handleShowSupport = () => setShowModalSupport(true);
  const handleShowReply = (id) => {
    setShowReplyForFeedbackId(id === showReplyForFeedbackId ? null : id);
    setFeedbackReply((prev) => ({
      ...prev,
      "feedback": id,
    }));
  };
  
  const handleClose = () => setShowModal(false);
  const handleCloseSupport = () => setShowModalSupport(false);
  const [successfulReplyForFeedbackId, setSuccessfulReplyForFeedbackId] = React.useState(null);

  const handleChangeReply = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setFeedbackReply((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  React.useEffect(() => {
    axios.get(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/event/${id}`, {})
    .then(function (response) {
      if (response.data.status === 1) {               
        setEventDetail((prev) => ({
          ...prev,
          id: response.data.data.event.id,
          ticket_types: response.data.data.event.ticket_types,
          event_topics: response.data.data.event.event_topic,
          name: response.data.data.event.name,
          description: response.data.data.event.description,
          start_date: response.data.data.event.start_date,
          end_date: response.data.data.event.end_date,
          start_time: response.data.data.event.start_time.slice(0, 5),
          location: response.data.data.event.location,
          banner_url: response.data.data.event.banner_url
        }));
        setOrgInfo(response.data.data.org_info);
        setRelatedEvents(response.data.data.related_events);
        console.log(response);
      } else {
        setErrors((prevalue) => ({
          ...prevalue,
          get_event_data_error: response.data.message
        }));
      }
    })
    .catch(function (error) {
      setErrors((prevalue) => ({
        ...prevalue,
        get_event_error: error
      }));
    });

    fetchFeedbacks();
  }, [id]);

  const fetchFeedbacks = () => {
    axios.get(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/event/${id}/feedback`, {})
    .then(function (response) {
      if (response.data.status === 1) {
        setFeedbacks(response.data.data.feedbacks);
      }
    });
  };

  React.useEffect(() => {
    setIsAPIResponsed(eventDetail.id !== '');
  }, [eventDetail]);

  let year, month, day;
  if (eventDetail.start_date && eventDetail.start_date.includes('-')) {
    [year, month, day] = eventDetail.start_date.split('-');
  }

  const buttonStyle = !isAPIResponsed ? { pointerEvents: 'none' } : {};
  const replyStyle = role !== "business" ? { pointerEvents: 'none' } : {};
  const repliedStyle = isReplied ? { pointerEvents: 'none' } : {};
  const inputStyle = { pointerEvents: 'none' };

  const handleSendReply = () => {
    axios.post(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/feedback-reply`, {
      content: feedbackReply.content,
      feedback: feedbackReply.feedback,
    })
    .then(function (response) {
      if (response.data.status === 1) {
        setSuccessfulReplyForFeedbackId(feedbackReply.feedback);
        setTimeout(() => {
          setSuccessfulReplyForFeedbackId(null);
          setShowReplyForFeedbackId(null);
        }, 1500);
        setFeedbackReply((prev) => ({
          ...prev,
          "content": "",
        }));
        fetchFeedbacks();
      }
    });
  };

  return (
    <div className="EventDetail__wrapper">
      <Header/>
      <div className="EventDetail__slide">
        <Swiper
          spaceBetween={40}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={false}
          modules={[Autoplay]}
          className="mySwiper-top"
        >
          <SwiperSlide>
            <img src={eventDetail?.banner_url} alt={'event banner'} className="banner__img" />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="EventDetail__demo">
        <div className='EventDetail__demo--wrapper'>
          <div className="EventDetail__demo--top">
            <h2 className="EventDetail__demo--title">{eventDetail?.name}</h2>
            {role === "customer" && (
              <div className="EventDetail__demo--btn">
                <button className="EventDetail__demo--buy_now" onClick={handleShow} style={buttonStyle}>
                  Mua ngay
                  <FontAwesomeIcon icon={faPaperPlane} className="icon_buy_now"/>
                </button>
                <Modal show={showModal} onHide={handleClose} size="xl">
                  <Modal.Header closeButton>
                    <Modal.Title>Mua vé</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <TicketSelectionForm event={eventDetail} />
                  </Modal.Body>
                </Modal>
                <button className="EventDetail__demo--support" onClick={handleShowSupport} style={buttonStyle}>
                  Hỗ trợ
                  <FontAwesomeIcon icon={faHeadset} className="icon_support"/>
                </button>
                <Modal show={showModalSupport} onHide={handleCloseSupport} size="xl">
                  <Modal.Header closeButton>
                    <Modal.Title>Hỗ trợ</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <SupportForm event={eventDetail} handleCloseSupport={handleCloseSupport} />
                  </Modal.Body>
                </Modal>
              </div>
            )}
          </div>
          <div className="EventDetail__demo--container">
            <span className="EventDetail__demo--infor">
              <FontAwesomeIcon icon={faClock} className="icon_infor"/>
              {eventDetail?.start_time}
            </span>
            <span className="EventDetail__demo--infor">
              <FontAwesomeIcon icon={faCalendarDays} className="icon_infor"/>
              Ngày {day} Tháng {month} Năm {year}
            </span>
            <span className="EventDetail__demo--infor">
              <FontAwesomeIcon icon={faLocationDot} className="icon_infor"/>
              {eventDetail.location}
            </span>
          </div>
        </div>
      </div>
      <div className="EventDetail__detail">
        <div className='EventDetail__detail--wrapper'>
          <h2 className="EventDetail__detail--title">Giới thiệu về sự kiện</h2>
          <span className="EventDetail__detail--description">{eventDetail.description}</span>
        </div>
      </div>
      <div className="EventDetail__product_infor">
        <div className='EventDetail__product_infor--wrapper'>
          <h2 className="EventDetail__product_infor--title">Thông tin sản phẩm</h2>
          {eventDetail.ticket_types.map((ticketType) => {
            let formattedNumber = ticketType.price.toLocaleString('en-US');
            return (
              <div className="ticket" key={ticketType.id}>
                <FontAwesomeIcon icon={faPaperPlane} className="icon_buy_now"/>
                <span className='ticket__type'>{ticketType.name}</span>
                <span className='ticket__price'>{formattedNumber} VNĐ</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="EventDetail__business_infor">
        <div className='EventDetail__business_infor--wrapper'>
          <h2 className="EventDetail__business_infor--title">Thông tin đơn vị tổ chức</h2>
          <div className="EventDetail__business_infor--detail">
            <img src={orgInfo?.avatar_url} alt={"bussiness image"} className="bussiness_image" />
            <span className='business_name'>{orgInfo?.first_name} {orgInfo?.last_name}</span>
          </div>
        </div>
      </div>
      <div className="EventDetail_feedback">
        <div className="EventDetail_feedback--wrapper">
          <h2 className="EventDetail__feedback--title">Đánh giá sự kiện</h2>
          {feedbacks && feedbacks.map((feedback, index) => {
            const feedback_replies = feedback.feedback_replies;
            const isReplying = showReplyForFeedbackId === feedback.id;
            const isRepliedForId = successfulReplyForFeedbackId === feedback.id;
            return (
              <div key={index} className='Feedback_info'>
                <div className='Feedback_request'>
                  <div className="Feedback__top">
                    <img src={feedback?.owner_avatar_url} alt="user avt" className='Feedback__user_avt'/>
                    <div className="Feedback__header">
                      <span className="Feedback__user_name">{feedback?.owner_last_name} {feedback?.owner_first_name}</span>
                      <ReactStars
                        name="rating"
                        count={5}
                        size={18}
                        edit={false}
                        value={feedback?.rating_score}
                        style={inputStyle}
                      />
                      <span className="Feedback_title">{feedback?.title}</span>
                    </div>
                  </div>
                  <div className="Feedback__body">
                    <span className="Feedback_content__value">{feedback?.content}</span>
                  </div>
                </div>
                {role === "business" && (
                  <button className={isReplying ? "Feedback__reply_btn reply_active" : "Feedback__reply_btn not_click_reply"} onClick={() => handleShowReply(feedback.id)} style={buttonStyle}>
                    Phản hồi
                  </button>
                )}
                {isReplying && (
                  <div className="Reply__content">
                    <textarea
                      type="text"
                      id="content"
                      value={feedbackReply.content}
                      readOnly={isReplied}
                      disabled={isReplied}
                      name="content"
                      placeholder='Nội dung...'
                      className={errors.feedback_reply_content ? "Feedback_form__input error-input" : "Feedback_form__input normal-input"}
                      onChange={(e) => handleChangeReply(e)}
                      rows={4}
                      cols={40}
                      style={repliedStyle}
                    />
                    {errors["feedback_reply_content"] && <span className="error">{errors["feedback_reply_content"]}</span>}
                  </div>
                )}
                {isRepliedForId && <span className="successful">Gửi phản hồi thành công!</span>}
                {isReplying && <button className="Send_reply_btn" onClick={handleSendReply}>Gửi phản hồi</button>}
                <div className='Feedback_reply'>
                  {feedback_replies && feedback_replies.map((feedback_reply, index) => (
                    <div className="Feedback_reply__body" key={index}>
                      <span className="Feedback_reply__title">Phản hồi từ ban tổ chức sự kiện</span>
                      <span className="Feedback_reply_content__value">{feedback_reply?.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="EventDetail__relative_event">
        <div className='EventDetail__relative_event--wrapper'>
          <h2 className="EventDetail__relative_event--title">Sự kiện liên quan</h2>
          <div className={relatedEvents.length <4 ? "EventDetail__relative_event--container": "EventDetail__relative_event--container justy-bet"}>
            {relatedEvents.map((relatedEvent, index) => {
              let [year, month, day] = relatedEvent.start_date.split('-');
              return (
                <Link to={`/event-detail/${relatedEvent.id}`} key={relatedEvent?.id} className="event">
                  <img src={relatedEvent?.banner_url} alt="banner event" className="event__banner" />
                  <div className="event__date">
                    <span className="event__month">Tháng {month}</span>
                    <span className="event__day">{day}</span>
                    <span className="event__year">{year}</span>
                  </div>
                  <div className='event__info'>
                    <span className="event__sales">
                      <FontAwesomeIcon icon={faEye} className="event--icon" />
                      {relatedEvent?.sales}
                    </span>
                    <span className="event__address">
                      <FontAwesomeIcon icon={faLocationDot} className="event--icon" />
                      {relatedEvent?.location}
                    </span>
                    <span className="event__price">
                      <FontAwesomeIcon icon={faHandHoldingDollar} className="event--icon" />
                      {relatedEvent?.price}
                    </span>
                  </div>
                  <div className="event__title">{relatedEvent?.name}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default EventDetail;