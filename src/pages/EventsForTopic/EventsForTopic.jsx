import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import "chart.js/auto";

// import style css
import './EventsForTopic.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// import component
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos'
import { APP_ENV } from "../../configs/app_config"
import Header from '../../components/Header';
import axios from 'axios';
import Footer from '../../components/Footer';
import { Link, useLocation, useParams } from 'react-router-dom';

function EventsForTopic() {
  let { id } = useParams();
  // let query = new URLSearchParams(useLocation().search);
  const location = useLocation();
  const { eventTopic } = location.state || "";

  const [events, setEvents] = React.useState([])

  React.useEffect(() => {
    axios.get(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/event-topic/${id}/events`, {
      id:id,
    })
    .then(function (response) {
      if (response.data.status === 1) {
        setEvents(response.data.data);
      }
    })
  }, [id]);

  return (
    <div className="EventsForTopic__wrapper">
      <Header/>
      <div className="EventsForTopic__events">
        <h2 className="EventsForTopic__events--title">Các sự kiện thuộc thể loại {eventTopic}</h2>
        <div className="EventsForTopic__events--container">
          {events.length !==0 ? (events.map((event)=>{
            let [year, month, day] = event.start_date.split('-');
            return (
              <Link to={`/event-detail/${event.id}`} key={event?.id} className="event">
                <img src={event?.banner_url} alt="banner event" className="event__banner" />
                <div className="event__date">
                    <span className="event__month">Tháng {month}</span>
                    <span className="event__day">{day}</span>
                    <span className="event__year">{year}</span>
                </div>
                <div className='event__info'>
                  {event.sales && 
                    <span className="event__sales">
                      <FontAwesomeIcon icon={faEye} className="event--icon" />
                      {event?.sales}
                    </span>
                  }
                  <span className="event__address">
                    <FontAwesomeIcon icon={faLocationDot} className="event--icon" />
                    {event?.location}
                  </span>
                  {/* <span className="event__price">
                    <FontAwesomeIcon icon={faHandHoldingDollar} className="event--icon" />
                    {event?.price}
                  </span> */}
                </div>
                <div className="event__title">{event?.name}</div>
              </Link>
          )})) : (
            <span className="Get_events_null">Không tìm thấy sự kiện nào thuộc thể loại này</span>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default EventsForTopic;