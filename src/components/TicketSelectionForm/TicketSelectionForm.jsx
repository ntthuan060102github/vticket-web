import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'react-datetime/css/react-datetime.css';
import './TicketSelectionForm.css';
import VTICKET_API_SERVICE_INFOS from '../../configs/api_infos';
import { APP_ENV } from "../../configs/app_config";

import DiscountForm from '../DiscountForm'

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
      setSelectedSeatList(selectedSeatList.filter(seatItem => seatItem !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
      setSelectedSeatList([...selectedSeatList, seat]);
    }
    console.log(selectedSeats);
    console.log(selectedSeatList);
  };

  const [origin, setOrigin] = useState(0);
  const handleOrigin = () =>{
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

  const handleBooking = () => {
    const newErrors = {};
    setErrors([]);

    if (!selectedTicketType) {
      newErrors["selected__ticket_type_error"] = "Loại vé không được để trống";
      setErrors((prevalue) => {
        return {
          ...prevalue,
          selected__ticket_type_error: "Loại vé không được để trống"
        }
      });
    }

    if (selectedSeats.length === 0) {
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
            setOrigin(handleOrigin);
            setBillValue(handleOrigin);
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
  };
  const [discounts, setDiscounts] = useState([]);

  useEffect(()=>{
    axios.post(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/ticket/booking/promotion`, {
      booking_id: bookingID,
    })
      .then(function (response) {
        console.log(response);
        if (response.data.status === 1) {
          setDiscounts(response.data.data?.promotions)
        }
      })
  },[bookingID])

  const handlePayment = () => {
    axios.post(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/ticket/pay`, {
      booking_id: bookingID,
      discount: discountID,
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
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [billValue, setBillValue] = useState(0);
  const [tax, setTax] = useState([]);
  const [discountID, setDiscountID] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleSelectDiscount = (discount) => {
    setSelectedDiscount(discount);
    setDiscountCode(discount.title);
    setDiscountID(discount.id);
    setShowModal(false);
    axios.post(`${VTICKET_API_SERVICE_INFOS.event[APP_ENV].domain}/ticket/pay/preview`, {
      booking_id: bookingID,
      discount: discountID
    })
      .then(function (response) {
        console.log(response);
        if (response.data.status === 1) {
          setBillValue(response.data.data?.bill_value);
          setTax(response.data.data?.calculate_detail?.tax);
          setDiscountAmount(response.data.data?.calculate_detail?.discount);
          setOrigin(response.data.data?.calculate_detail?.origin);
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
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <Container>
      <h2 className='Ticket_select_form__event_name'>{event.name}</h2>

      {!showPaymentDialog ? (
        <div className='selectSeatForm'>
          <Form.Group
            controlId="ticketTypeSelect"
            className='Select_ticket'
          >
            <Form.Label>Chọn vé</Form.Label>
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
                  if (!seat.is_not_available) {
                    return (
                      <Col key={seat.id} xs={1} className="mb-2">
                        <Form.Check
                          type="checkbox"
                          label={`${seat.position}${seat.seat_number}`}
                          onChange={() => handleSeatChange(seat)}
                          checked={selectedSeats.includes(seat.id)}
                        />
                      </Col>
                    )
                  }
                })}
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
        </div>) :
        <div className='paymentForm'>
          <div className='payment_top'>
            <div className='payment_amount'>
              <h3 className='payment_amount__title'>Thông tin thanh toán</h3>
              <div className='payment_method'><b>Phương thức thanh toán:</b> <img src='https://storage.googleapis.com/vticket-1ccb9.appspot.com/f146aa6e-a073-4752-b386-9796e2035ea4_vnpay-logo-CCF12E3F02-seeklogo.com.png' alt='vnpay logo' className='vnpay_logo'></img></div>
              <div className='origin_amount'><b>Số tiền tạm tính:</b> <span className='amount_origin'>{origin} VND</span></div>
              <div className="tax">
                <span className='tax_title'>Thuế: <span className='amount_increase'>{tax.length ===0 && ("+ 0 VND")}</span></span>
                {tax.length!==0 && 
                (tax.map((taxItem, index)=>(<div key={index} className='tax_detail'><b>{taxItem.name}:</b> <span className='amount_increase'>+ {taxItem.value} VND</span></div>)))}
              </div>
              <div className='discount'><b>Khuyến mãi:</b> <span className='amount_decide'>- {discountAmount} VND</span></div>
              <div className="line"></div>
              <div className='total_amount'><b>Tổng số tiền cần trả:</b> {billValue} VND</div>
            </div>
            <div className="payment_discount">
              <Form>
                <Form.Group className='Form_discount'>
                  <Form.Label>Mã giảm giá:</Form.Label>
                  <Form.Control
                    type="text"
                    value={discountCode}
                    class_name="display_discount_code"
                    onChange={(e) => setDiscountCode(e.target.value)}
                    readOnly
                  />
                  <Button variant="primary" onClick={handleShowModal} className="mt-2 select_discount_btn">
                    Chọn Mã Giảm Giá
                  </Button>
                </Form.Group>
              </Form>

              {selectedDiscount && (
                <div className="display_selected_discount">
                  <h5 className='display_selected_discount__title'>Thông tin mã giảm giá đã chọn:</h5>
                  <p>Tiêu đề: {selectedDiscount.title}</p>
                  <p>Mô tả: {selectedDiscount.desc}</p>
                  <p>Số lượng: {selectedDiscount.quantity}</p>
                  <p>Giảm: {selectedDiscount.amount} VND</p>
                </div>
              )}

              <DiscountForm
                show={showModal}
                handleClose={handleCloseModal}
                discounts={discounts}
                handleSelectDiscount={handleSelectDiscount}
              />
            </div>
          </div>
          <Button variant="primary" onClick={handlePayment}>Thanh toán</Button>
        </div>
      }
    </Container>
  );
};

export default TicketSelectionForm;
