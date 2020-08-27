import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Settings as SettingsIcon } from '../../assets';

const Root = styled.div``;

const fadeInAnimation = keyframes`
  from {opacity: 0}
`;

const slideRight = keyframes`
  from {transform: translateX(500px); opacity: 0.5};
`;

const Overlay = styled.div`
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

const Modal = styled.div`
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

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7.5px 10px;
  border-bottom: 1px solid ${p => p.theme.border};
`;

const Title = styled.h1`
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

const ModalBody = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px 10px;
`;

const Close = styled.button`
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
  border-radius: 3px;
  margin: 0;
  padding: 0 10px;
  height: 35px;
  outline: 0;
  font-weight: bold;
  transition: 0.4s border;
  display: inline-block;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  &:focus,
  &:hover {
    border-color: ${p => p.theme.primary};
  }
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  color: ${p => p.theme.light};
  margin-bottom: 3px;
`;

const Protocol = styled.button`
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

const UrlInputContainer = styled.div`
  display: flex;
  align-items: center;
`;

let settingsDebounce;

export default function Settings({ close, ctx, fetchData }) {
  const { url, protocol } = ctx;

  // Refetch on settings change
  useEffect(() => {
    clearTimeout(settingsDebounce);
    settingsDebounce = setTimeout(() => {
      // Sanitize fields
      let sanitizedUrl = url;
      let sanitizedProtocol = protocol;
      if (sanitizedUrl && sanitizedUrl.endsWith('/')) {
        sanitizedUrl = url.slice(0, -1);
      }
      if (sanitizedUrl && sanitizedUrl.endsWith('/feathers-debugger')) {
        sanitizedUrl = url.slice(0, -18);
      }
      if (sanitizedUrl && sanitizedUrl.startsWith('http://')) {
        sanitizedUrl = url.slice(7);
        sanitizedProtocol = 'http';
      }
      if (sanitizedUrl && sanitizedUrl.startsWith('https://')) {
        sanitizedUrl = url.slice(8);
        sanitizedProtocol = 'https';
      }
      ctx.update({ url: sanitizedUrl, protocol: sanitizedProtocol }, fetchData);
    }, 500);
  }, [url, protocol]);

  const changeProtocol = () => {
    ctx.update({ protocol: protocol === 'http' ? 'https' : 'http' });
  };

  return (
    <Root>
      <Overlay onClick={close} />
      <Modal>
        <ModalHeader>
          <Title>
            <SettingsIcon />
            Settings
          </Title>
          <Close onClick={close}>&times;</Close>
        </ModalHeader>
        <ModalBody>
          <Label>Server URL:</Label>
          <UrlInputContainer>
            <Protocol onClick={changeProtocol}>{protocol}</Protocol>
            <UrlInput
              data-tip="Feathers Server URL (without trailing slash and /feathers-debugger)"
              type="url"
              onChange={e => ctx.update({ url: e.target.value })}
              value={url}
            />
          </UrlInputContainer>
        </ModalBody>
      </Modal>
    </Root>
  );
}
