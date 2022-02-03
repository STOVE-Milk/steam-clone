import React, { useState } from 'react';

import Modal from 'components/atoms/Modal';

const ModalPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      <Modal onClose={() => setShowModal(false)} show={showModal}>
        Hello from the modal!
      </Modal>
    </div>
  );
};

export default ModalPage;
