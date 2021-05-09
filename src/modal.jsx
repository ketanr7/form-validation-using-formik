import React from 'react';
import { Button,Modal } from 'react-bootstrap';


function SuccessModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    > 
      <Modal.Body>
        <h4 style={{textAlign:'center',fontSize:'30px',marginTop:'30px',marginBottom:'30px'}}>Thank You !</h4>
        <p style={{textAlign:'center',fontSize:'20px',marginTop:'15px',marginBottom:'15px'}}>
          Data submitted successfully.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SuccessModal;