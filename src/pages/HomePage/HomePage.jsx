import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCalendarDays, faClock, faEye, faHandHoldingDollar, faLocationDot, faPlus } from '@fortawesome/free-solid-svg-icons';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// // Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SwiperCore from 'swiper';
// // import required modules
import { Autoplay, EffectCards } from 'swiper/modules';

// import style css
import './HomePage.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// import component
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import Header from '../../components/Header';
import NavTopCus from '../../components/NavTopCus';
import axios from 'axios';

SwiperCore.use([EffectCards]);

function HomePage() {
  const [errors, setErrors] = React.useState({});
  const [banners, setBanners] = React.useState([])
  const [outstandingEvents, setOutstandingEvents] = React.useState([])
  const [upcomingEvents, setUpcomingEvents] = React.useState([])
  const [topicTypes, setTopicTypes] =React.useState([])

  React.useEffect(() => {
    axios.get(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/client-page/home`, {
    })
    .then(function (response) {
      if (response.data.status === 1) {
        console.log(response.data.data.outstanding_events);
        console.log(response.data.data.upcoming_events);
        console.log(response.data.data.topic_types);
        
        setBanners(response.data.data.banners)
        setOutstandingEvents(response.data.data.outstanding_events)
        setUpcomingEvents(response.data.data.upcoming_events)
        setTopicTypes(response.data.data.topic_types)
      } else {
        setErrors((prevalue) => {
          return {
            ...prevalue,
            get_event_topic_data_error: response.data.message
          }
        });
      }
    })
    .catch(function (error) {
      setErrors((prevalue) => {
        return {
          ...prevalue,
          get_event_topic_error: error
        }
      });
    });
  }, []);

  return (
    <div className="Homepage__wrapper">
      <Header/>
      <NavTopCus/>
      <div className="Homepage__slide">
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
          {banners.map((banner, index) => {
            let [year, month, day] = banner.start_date.split('-');
            return (
            <SwiperSlide key={index}>
              <img src={banner?.banner_url} alt={`comic img ${index + 1}`} className="banner__img" />
              <div className="Slide__info">
                <h2 className="Slide__title">{banner?.name}</h2>
                <div className="Slide__location">
                    <div className="Slide__date">
                      <span className="Slide__month">Tháng {month}</span>
                      <span className="Slide__day">{day}</span>
                      <span className="Slide__year">{year}</span>
                    </div>
                    <div className="Slide__address">
                      <span className="Slide__time">
                        <FontAwesomeIcon icon={faClock} className="Header__search--icon"/>
                        {banner?.start_time}
                      </span>
                      <span className="Slide__place">
                        <FontAwesomeIcon icon={faLocationDot} className="Header__search--icon"/>
                        {banner?.location}
                      </span>
                    </div>
                </div>
              </div>
            </SwiperSlide>
          )})}
        </Swiper>
      </div>
      <div className="Homepage__outstanding_events">
        <div className="Homepage__outstanding_events--top">
          <h2 className="Homepage__outstanding_events--title">Sự kiện nổi bật</h2>
          <div className='Homepage__outstanding_events--btn'>
            <button className="Homepage__outstanding_events--calendar">
              <FontAwesomeIcon icon={faCalendarDays} className="icon_calendar"/>
              Lịch sự kiện
            </button>
            <button className="Homepage__outstanding_events--send">
              <FontAwesomeIcon icon={faPlus} className="icon_plus"/>
              Gửi sự kiện
            </button>
          </div>
        </div>
        <div className="Homepage__outstanding_events--container">
          {outstandingEvents.map((outstandingEvent,index)=>(
            <img src={outstandingEvent.banner_url} alt={`poster + ${index + 1}`} className={index < 1 ? 'poster__top' : 'poster__bottom'} />
          ))}
        </div>
      </div>
      <div className="Homepage__comming_soon_events">
        <h2 className="Homepage__comming_soon_events--title">Sự kiện sắp diễn ra</h2>
        <div className="Homepage__somming_soon_events--container">
          {upcomingEvents.map((upcomingEvent,index)=>{
            let [year, month, day] = upcomingEvent.start_date.split('-');
            return (
            <div className="event">
                <img src={upcomingEvent?.src} alt="banner event" className="event__banner" />
                <div className="event__date">
                    <span className="event__month">Tháng {month}</span>
                    <span className="event__day">{day}</span>
                    <span className="event__year">{year}</span>
                </div>
                <div className='event__info'>
                  <span className="event__sales">
                    <FontAwesomeIcon icon={faEye} className="event--icon" />
                    {upcomingEvent?.sales}
                  </span>
                  <span className="event__address">
                    <FontAwesomeIcon icon={faLocationDot} className="event--icon" />
                    {upcomingEvent?.location}
                  </span>
                  <span className="event__price">
                    <FontAwesomeIcon icon={faHandHoldingDollar} className="event--icon" />
                    {upcomingEvent?.price}
                  </span>
                </div>
                <div className="event__title">{upcomingEvent?.name}</div>
            </div>
          )})}
        </div>
        <button className="Homepage__somming_soon_events--more_btn">
          <FontAwesomeIcon icon={faBars} className="icon_plus"/>
          Xem thêm các sự kiện sắp diễn ra
        </button>
      </div>
      <div className="Homepage__event_topics">
        <h2 className="Homepage__event_topics--title">Thể loại sự kiện</h2>
        <div className="Homepage__event_topics--container">
          {topicTypes.map((eventTopic,index)=>{
            const class_name = (index === 1 || index === 5) ? 'event_topic_big' : 'event_topic_small';
            return (
            <div className={class_name}>
                <img src={eventTopic?.symbolic_image_url} alt="banner eventTopic" className="event_topic__banner" />
                <div className="event_topic__title">{eventTopic?.name}</div>
            </div>
          )})}
        </div>

      </div>
    </div>
  );
}

export default HomePage;