import * as React from 'react';
import axios from 'axios';
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos';
import { APP_ENV } from "../../configs/app_config";

import Header from "../../components/Header";
import './UpcommingEvents.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faLocationDot } from '@fortawesome/free-solid-svg-icons';

function UpcommingEvents() {

    const [events, setEvents] = React.useState([]);
    const [pageNum, setPageNum] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(12);
    const [numPages, setNumPages] = React.useState(0);

    React.useEffect(() => {
        fetchEvents();
    }, [pageNum, pageSize]);

    const fetchEvents = async () => {
        axios({
            method: 'get',
            url: `${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/event/upcomming?page_num=${pageNum}&page_size=${pageSize}`,
            data: {
                page_num: pageNum,
                page_size: pageSize,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(function (response) {
                console.log(response);
                if (response.data.status === 1) {
                    setEvents(response.data.data?.data);
                    setNumPages(response.data.data?.num_pages);
                }
            })
    };

    const handlePageChange = (newPageNum) => {
        setPageNum(newPageNum);
    };

    const handlePrevPage = () => {
        if (pageNum - 1 > 0) {
            setPageNum(pageNum - 1);
        }
    };
    const handleNextPage = () => {
        if (pageNum + 1 <= numPages) {
            setPageNum(pageNum + 1);
        }
    };

    return (
        <div className="uppcomming_event__wrapper">
            <Header />
            <div className="uppcomming_event">
                <h2 className="uppcomming_event--title">Sự kiện sắp diễn ra</h2>
                <div className="uppcomming_event--container">
                    <div className="uppcomming_event--event_list">
                        {events.length !== 0 ? events.map((event) => {
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
                            )
                        }) : (
                            <span className="Get_events_null">Không tìm thấy sự kiện nào</span>
                        )}
                    </div>
                </div>
                <div className="line"></div>
                <div className='pagination_events'>
                    <button className="pagination__previous" onClick={handlePrevPage}>← Quay lại</button>
                    {numPages !== 0 && Array(numPages).fill(0).map((_, index) => (
                    <button key={index} onClick={() => handlePageChange(index + 1)} className={(index + 1) === pageNum ? 'pagination__page_num--active' : 'pagination__page_num--unactive'}>
                        {index + 1}
                    </button>))}
                    <button className="pagination__previous" onClick={handleNextPage}>Tiếp theo →</button>
                </div>
            </div>
        </div>
    );
}

export default UpcommingEvents;