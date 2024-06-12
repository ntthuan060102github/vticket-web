import * as React from 'react';
import ReactStars from "react-rating-stars-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCalendarDays, faClock, faEye, faHandHoldingDollar, faHeadset, faLocationDot, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import TicketSelectionForm from '../../components/TicketSelectionForm';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import "chart.js/auto";

// // Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SwiperCore from 'swiper';
// // import required modules
import { Autoplay, EffectCards } from 'swiper/modules';

// import style css
import './EventDetail.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// import component
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import Header from '../../components/Header';
import NavTopCus from '../../components/NavTopCus';
import axios from 'axios';
import Footer from '../../components/Footer';
import { Link, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import SupportForm from '../../components/SupportForm';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

SwiperCore.use([EffectCards]);

function EventDetail() {
  const query = useQuery();
  const feedbackable = query.get('feedbackable');
  const [isFeedbackable, setIsFeedbackable ] = React.useState(feedbackable !== 'false' && feedbackable !== null );
  let { slug } = useParams();
  
  const [feedbacked, setFeedbacked] = React.useState(false);
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

  const [feedback, setFeedback] = React.useState(
    {
      "title": "",
      "content":"",
      "rating_score": 0,
      "event": slug
    }
  )

  const [upcomingEvents, setUpcomingEvents] = React.useState([
    {
      "id": 4,
      "name": "Liveconcert Phương Thanh 2024 - Đóa Hồng Gai",
      "description": "Liveconcert Phương Thanh 2024 - Đóa Hồng Gai diễn ra tại Hoàn Kiếm, Hà Nội từ ngày 23 thàng 6 đến ngày 1 tháng 7 năm 2024 vào lúc 11:00 mỗi ngày.",
      "start_date": "2024-06-23",
      "end_date": "2024-07-01",
      "start_time": "11:00:00",
      "location": "Hoàn Kiếm, Hà Nội",
      "banner_url": "https://storage.googleapis.com/vticket-1ccb9.appspot.com/4556a0e3-1c46-4b83-8d5f-d8681c5d7e85_phuongthanh_concert.jpg",
      "created_at": "2024-05-20T13:09:40.890948Z",
      "event_topic": []
    },
    {
      "id": 8,
      "name": "Giải bóng đá học sinh",
      "description": "Giải bóng đá dành cho học sinh trung học",
      "start_date": "2024-07-05",
      "end_date": "2024-07-06",
      "start_time": "15:00:00",
      "location": "Sân bóng đá thành phố",
      "banner_url": "https://storage.googleapis.com/vticket-1ccb9.appspot.com/6abbc824-2a55-46fc-9527-81dfa5ec363b__MG_8003.JPG",
      "created_at": "2024-05-17T13:09:40.890948Z",
      "event_topic": []
    }
  ])
  // const [topicTypes, setTopicTypes] =React.useState([])
  const [showModal, setShowModal] = React.useState(false);
  const [showModalSupport, setShowModalSupport] = React.useState(false);

  const handleShow = () => setShowModal(true);
  const handleShowSupport = () => setShowModalSupport(true);
  
  const handleClose = () => setShowModal(false);
  const handleCloseSupport = () => setShowModalSupport(false);

  React.useEffect(() => {
    axios.get(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/event/${slug}`, {
    })
    .then(function (response) {
      if (response.data.status === 1) {               
        setEventDetail((prev)=>{
          return {
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
          }
        })
        setOrgInfo(response.data.data.org_info);
        setRelatedEvents(response.data.data.related_events);
      } else { 
        setErrors((prevalue) => {
          return {
            ...prevalue,
            get_event_data_error: response.data.message
          }
        });
      }
    })
    .catch(function (error) {
      setErrors((prevalue) => {
        return {
          ...prevalue,
          get_event_error: error
        }
      });
    });
  }, []);

  let year, month, day;
  if (eventDetail.start_date && eventDetail.start_date.includes('-')) {
    [year, month, day] = eventDetail.start_date.split('-');
  }

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
    <div className="EventDetail__wrapper">
      <Header/>
      <NavTopCus/>
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
            <button className="EventDetail__demo--buy_now" onClick={handleShow}>
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
            <button className="EventDetail__demo--support" onClick={handleShowSupport}>
              Hổ trợ
              <FontAwesomeIcon icon={faHeadset} className="icon_support"/>
            </button>
            <Modal show={showModalSupport} onHide={handleCloseSupport} size="xl">
              <Modal.Header closeButton>
                <Modal.Title>Hổ trợ</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <SupportForm event={eventDetail} />
              </Modal.Body>
            </Modal>
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
            {eventDetail.ticket_types.map((ticketType)=>{
              let formattedNumber = ticketType.price.toLocaleString('en-US'); 
              return(
                <div className="ticket" key={ticketType.id}>
                  <FontAwesomeIcon icon={faPaperPlane} className="icon_buy_now"/>
                  <span className='ticket__type'>{ticketType.name}</span>
                  <span className='ticket__price'>{formattedNumber} VNĐ</span>
                </div>
              )
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
      </div>
      <div className="EventDetail__relative_event">
        <div className='EventDetail__relative_event--wrapper'>
            <h2 className="EventDetail__relative_event--title">Sự kiện liên quan</h2>
            <div className="EventDetail__relative_event--container">
              {relatedEvents.map((relatedEvent,index)=>{
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
              )})}
            </div>
            <button className="EventDetail__relative_event--more_btn">
              <FontAwesomeIcon icon={faBars} className="icon_plus"/>
              Xem thêm các sự kiện liên quan
            </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default EventDetail;