import styled, { keyframes, css } from 'styled-components';
import { Btn, BtnGroup } from '../Styled';

export { Btn, BtnGroup };
export const Root = styled.div``;

const fadeInAnimation = keyframes`
  from {opacity: 0}
`;

const slideRight = keyframes`
  from {transform: translateX(500px); opacity: 0.5};
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${p => p.theme.modalOverlay};
  z-index: 10;
  cursor: pointer;
  animation: ${fadeInAnimation} 0.2s;
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  min-width: 300px;
  background: white;
  height: 100vh;
  z-index: 11;
  display: flex;
  box-shadow: -10px 10px 20px #3f2b66, 10px -10px 20px #734db8;
  animation: ${slideRight} 0.3s;
  animation-fill-mode: forwards;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7.5px 10px;
  border-bottom: 1px solid ${p => p.theme.border};
`;

export const Title = styled.h1`
  font-size: 13px;
  line-height: 1;
  font-weight: 600;
  color: ${p => p.theme.text};
  display: flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 1.2px;

  svg {
    margin-right: 10px;
    width: 16px;
    height: 16px;
    path {
      fill: ${p => p.theme.light};
    }
  }
`;

export const ModalBody = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px 10px;
`;

export const Close = styled.button`
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  transition: background 0.1s;
  &:hover {
    background: ${p => p.theme.background};
    color: ${p => p.theme.primary};
  }
`;

export const UrlInput = styled.input`
  font-size: 15px;
  height: 30px;
  border: 1px solid ${p => p.theme.border};
  margin: 0;
  padding: 0 10px;
  height: 35px;
  outline: 0;
  font-weight: bold;
  transition: 0.4s border;
  display: inline-block;
  border-radius: 0;
  &:focus,
  &:hover {
    border-color: ${p => p.theme.primary};
  }
`;

const rotateAnimation = keyframes`
  from {transform: rotate(0)}
  to {transform: rotate(360deg)}
`;

export const ConnectionState = styled.div`
  border-radius: 3px;
  border: 1px solid ${p => p.theme.border};
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding: 0 10px;
  border-left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  svg {
    fill: ${p => (p.error ? p.theme.danger : p.theme.success)};
    ${p =>
      p.loading &&
      css`
        fill: ${p.theme.light};
        animation: ${rotateAnimation} 1.5s linear;
      `}
    width: 18px;
    height: 18px;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 12px;
  color: ${p => p.theme.light};
  margin-bottom: 3px;
`;

export const Protocol = styled.button`
  display: inline-block;
  color: ${p => p.theme.primary};
  border: 1px solid ${p => p.theme.border};
  height: 35px;
  padding: 0 5px;
  font-weight: bold;
  display: flex;
  flex-shrink: 0;
  font-size: 10px;
  font-weight: bold;
  width: 45px;
  border-right: 1px solid transparent;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  &:hover {
    background: ${p => p.theme.background};
    border-color: ${p => p.theme.primary};
  }
`;

export const UrlInputContainer = styled.div`
  display: flex;
  align-items: center;
`;
export const Group = styled.div`
  margin: 10px 0;
`;

export const Footer = styled.div`
  padding: 10px;
  font-size: 10px;
  color: ${p => p.theme.light};
`;
