import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';

const DiscountForm = ({ show, handleClose, discounts, handleSelectDiscount }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Chọn Mã Giảm Giá</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {discounts && discounts.map((discount, index) => (
                        <ListGroup.Item key={index} onClick={() => handleSelectDiscount(discount)}>
                            <h5>{discount?.pretty_name?.short_content}</h5>
                            <p>{discount?.pretty_name?.long_content}</p>
                            <p>Số lượng: {discount?.quantity}</p>
                            <p>Giảm: {discount?.evaluation_value} VND</p>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DiscountForm;
