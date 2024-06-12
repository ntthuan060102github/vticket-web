import React, { useState } from 'react';
import { Container, Row, Col, Form, Button} from 'react-bootstrap';
import axios from 'axios';
import 'react-datetime/css/react-datetime.css';
import './TicketSelectionForm.css';
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos';
import { APP_ENV } from "../../configs/app_config";

const TicketSelectionForm = ({ event }) => {
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSeatList, setSelectedSeatList] = useState([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [bookingID, setBookingID] = useState("");
  const [errors, setErrors] = React.useState({});

  const handleTicketTypeChange = (e) => {
    const ticketTypeId = parseInt(e.target.value);
    setSelectedTicketType(event.ticket_types.find(tt => tt.id === ticketTypeId));
  };

  const handleSeatChange = (seat) => {
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
      setSelectedSeatList(selectedSeatList.filter(seatItem=> seatItem !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
      setSelectedSeatList([...selectedSeatList, seat]);
    }
    console.log(selectedSeats);
    console.log(selectedSeatList);
  };
  
  const [totalAmount, setTotalAmount] = useState(0)
  const handleTotalAmount = () =>{
    let total = 0;
    for(let i =0 ; i < selectedSeatList.length; i++){
      for(let j =0 ; j < event.ticket_types.length; j++){
        if(event.ticket_types[j].id === selectedSeatList[i].ticket_type)
        {
          total = total + event.ticket_types[j].price;
        }
      }
    }
    return total;
  }

  const handleBooking = () =>{
    const newErrors = {};
    setErrors([]);

    if(!selectedTicketType){
      newErrors["selected__ticket_type_error"] = "Loại vé không được để trống";
      setErrors((prevalue) => {
        return {
          ...prevalue,
          selected__ticket_type_error: "Loại vé không được để trống"
        }
      });
    }

    if(selectedSeats.length === 0){
      newErrors["selected__seats_error"] = "Ghế không được để trống";
      setErrors((prevalue) => {
        return {
          ...prevalue,
          selected__seats_error: "Ghế không được để trống"
        }
      });
    }

    if (Object.values(newErrors).length === 0) {
      axios.post(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/ticket/booking`, {
        seats: selectedSeats,
        event: event.id
      })
      .then(function (response) {
        if (response.data.status === 1) { 
          console.log(response);
          setBookingID(response.data.data.booking_id);
          setTotalAmount(handleTotalAmount());
          setShowPaymentDialog(true);                        
        } else {
          console.log(response);  
          setErrors((prevalue) => {
            return {
              ...prevalue,
              ticket_booking_data_error: response.data.message
            }
          });
        }
      })
      .catch(function (error) {
        setErrors((prevalue) => {
          return {
            ...prevalue,
            ticket_booking_error: error
          }
        });
      });
    }
  }

  const handlePayment = () =>{
    axios.get(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/ticket/${bookingID}/pay`, {
      id: bookingID,
    })
    .then(function (response) {
      if (response.data.status === 1) { 
        console.log(response);
        window.location.href = response?.data?.data?.url;
      } else {
        console.log(response);  
        setErrors((prevalue) => {
          return {
            ...prevalue,
            ticket_payment_data_error: response.data.message
          }
        });
      }
    })
    .catch(function (error) {
      setErrors((prevalue) => {
        return {
          ...prevalue,
          ticket_payment_error: error
        }
      });
    });
  }

  return (
    <Container>
      <h2 className='Ticket_select_form__event_name'>{event.name}</h2>

      {!showPaymentDialog ? (
      <div className='selectSeatForm'> 
        <Form.Group 
          controlId="ticketTypeSelect" 
          className='Select_ticket'
        >
          <Form.Label>Chọn loại vé</Form.Label>
          <Form.Control 
            as="select" 
            onChange={handleTicketTypeChange} 
            className={errors["selected__ticket_type_error"] ? 'error-input' : 'normal-input'}>
            <option value="">Chọn loại vé...</option>
            {event.ticket_types.map(ticketType => (
              <option key={ticketType.id} value={ticketType.id}>{ticketType.name} - {ticketType.price} VND</option>
            ))}
          </Form.Control>
        </Form.Group>
        {errors["selected__ticket_type_error"] && <span className="error">{errors["selected__ticket_type_error"]}</span>}

        {selectedTicketType && (
          <div className='Select_seat'>
            <h3 className={errors["selected__seats_error"] && 'error-label'}>Chọn ghế cho {selectedTicketType.name}</h3>
            <Row>
              {selectedTicketType.seat_configurations.map(seat => {
                if(!seat.is_not_available){
                return (
                <Col key={seat.id} xs={1} className="mb-2">
                  <Form.Check 
                    type="checkbox" 
                    label={`${seat.position}${seat.seat_number}`} 
                    onChange={() => handleSeatChange(seat)}
                    checked={selectedSeats.includes(seat.id)}
                  />
                </Col>
              )}})}
            </Row>
            {errors["selected__seats_error"] && <span className="error">{errors["selected__seats_error"]}</span>}
          </div>
        )}
        <Button 
          variant="primary" 
          onClick={handleBooking}
        >
          Đặt vé
        </Button>
      </div> ) : 
      <div className='paymentForm'>
          <span className='total_amount'><b>Tổng số tiền cần trả:</b> {totalAmount} VND</span>
          <Button variant="primary" onClick={handlePayment}>Thanh toán</Button>
      </div>
      }
    </Container>
  );
};

export default TicketSelectionForm;
