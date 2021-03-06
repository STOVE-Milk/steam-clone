import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

export interface IModalProps {
  show: boolean; //모달 보여줌 여부
  onClose: () => void;
  title?: string; //모달 타이틀
  children: React.ReactChild; //모달 안에 들어갈 내용
  height: string;
}

export default function Modal(props: IModalProps) {
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
      <ModalWrapper show={props.show} height={props.height && props.height}>
        <ModalHeader>
          <CloseBtn onClick={handleCloseClick}>x</CloseBtn>
        </ModalHeader>
        {props.title && <div>{props.title}</div>}
        <ModalBody>{props.children}</ModalBody>
      </ModalWrapper>
    </ModalOverlay>
  ) : null;

  if (props.show && isBrowser) {
    //createPortal을 이용해 모달 생성
    return ReactDOM.createPortal(modalContent, document.getElementById('portal')!!);
  } else {
    return null;
  }
}

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

const ModalWrapper = styled.div<{ show: boolean; height: string }>`
  background: ${(props) => props.theme.colors.secondaryBg};
  width: 500px;
  height: ${(props) => props.height} !important;
  height: 600px;
  border-radius: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;

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

const CloseBtn = styled.span`
  color: white;
  cursor: pointer;
`;

const ModalBody = styled.div`
  padding-top: 10px;
  flex: 1;
`;
