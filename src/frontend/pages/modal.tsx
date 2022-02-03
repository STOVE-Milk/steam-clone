import React, { useState } from 'react';

import Modal from 'components/atoms/Modal';
import CardModal from 'components/molecules/CardModal';
import Portal from 'components/atoms/Portal';

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
