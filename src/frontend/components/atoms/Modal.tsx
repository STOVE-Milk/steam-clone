import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

export type ModalProps = {
  show: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactChild;
};

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalWrapper = styled.div<{ show: boolean }>`
  background: white;
  width: 500px;
  height: 600px;
  border-radius: 15px;
  padding: 15px;

  ${(props) =>
    props.show
      ? css`
          animation: popInFromBottom 0.4s forwards ease-in-out;
        `
      : css`
          animation: popOutToBottom 0.4s forwards ease-in-out;
        `}

  @keyframes popInFromBottom {
    0% {
      opacity: 0;
      transform: translateY(50%) scale(0.75);
    }
    75% {
      opacity: 1;
      transform: translateY(-10%) scale(1);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
  @keyframes popOutToBottom {
    0% {
      opacity: 1;
      transform: translateY(0px) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(50%) scale(0.75);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 25px;
`;

const ModalBody = styled.div`
  padding-top: 10px;
`;

export default function Modal(props: ModalProps) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    document.body.style.overflowY = props.show ? 'hidden' : 'initial';

    let timeoutId: any;

    if (props.show) {
      setIsBrowser(true);
    } else {
      timeoutId = setTimeout(() => {
        setIsBrowser(false);
      }, 5000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [props.show]);

  useEffect(() => {
    setIsBrowser(true);

    return () => {
      document.body.style.overflowY = 'initial';
    };
  }, []);

  const handleCloseClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    props.onClose();
  };

  const modalContent = props.show ? (
    <ModalOverlay>
      <ModalWrapper show={props.show}>
        <ModalHeader>
          <a href="#" onClick={handleCloseClick}>
            x
          </a>
        </ModalHeader>
        {props.title && <div>{props.title}</div>}
        <ModalBody>{props.children}</ModalBody>
      </ModalWrapper>
    </ModalOverlay>
  ) : null;

  if (props.show && isBrowser) {
    return ReactDOM.createPortal(modalContent, document.getElementById('portal')!!);
  } else {
    return null;
  }
}
