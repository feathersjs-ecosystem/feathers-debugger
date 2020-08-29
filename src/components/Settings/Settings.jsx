import React, { useEffect, useState } from 'react';
import ms from 'ms';
import ReactTooltip from 'react-tooltip';
import packageJson from '../../../package.json';
import {
  Settings as SettingsIcon,
  Check,
  ErrorTriangle,
  Sync,
} from '../../assets';

import {
  Root,
  Overlay,
  Modal,
  ModalHeader,
  Title,
  ModalBody,
  Close,
  UrlInput,
  Label,
  Protocol,
  UrlInputContainer,
  Group,
  Btn,
  BtnGroup,
  Footer,
  ConnectionState,
} from './SettingsStyles';

let settingsDebounce;

export default function Settings({ close, ctx, fetchData }) {
  const { url, protocol, pollInterval, pollIntervals, fetchError } = ctx;
  const [loading, setLoading] = useState(0);

  // Refetch on settings change
  useEffect(() => {
    clearTimeout(settingsDebounce);
    setLoading(1);
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
      setLoading(0);
    }, 500);
    return () => clearTimeout(settingsDebounce);
  }, [url, protocol, pollInterval]);

  const changeProtocol = () => {
    ctx.update({ protocol: protocol === 'http' ? 'https' : 'http' });
  };

  const changePollInterval = val => () => {
    ctx.update({ pollInterval: val });
  };

  return (
    <Root>
      <ReactTooltip
        delayShow={550}
        place="bottom"
        type="dark"
        effect="solid"
        id="settings-tooltip"
      />
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
          <Group>
            <Label>Server URL:</Label>
            <UrlInputContainer>
              <Protocol
                data-for="settings-tooltip"
                data-tip="Protocol (http or https)"
                onClick={changeProtocol}
              >
                {protocol}
              </Protocol>
              <UrlInput
                data-multiline
                data-for="settings-tooltip"
                data-tip="Feathers Server URL <br/> Without trailing slash and /feathers-debugger"
                type="url"
                onChange={e => ctx.update({ url: e.target.value })}
                value={url}
              />
              <ConnectionState
                error={fetchError || 0}
                loading={loading}
                data-for="settings-tooltip"
                data-tip="Connnection state"
              >
                {fetchError && !loading && <ErrorTriangle />}
                {!fetchError && !loading && <Check />}
                {loading === 1 && <Sync />}
              </ConnectionState>
            </UrlInputContainer>
          </Group>

          <Group>
            <Label>Poll Interval:</Label>
            <BtnGroup
              style={{ margin: 0 }}
              data-for="settings-tooltip"
              data-tip="How often to refresh data, only used in watch mode."
            >
              {pollIntervals.map(int => (
                <Btn
                  key={int}
                  onClick={changePollInterval(int)}
                  active={pollInterval === int}
                >
                  {ms(int)}
                </Btn>
              ))}
            </BtnGroup>
          </Group>
        </ModalBody>
        <Footer>
          <a
            href="https://github.com/radenkovic/feathers-debugger"
            target="_blank"
            rel="noreferrer"
          >
            Feathers Debugger
          </a>{' '}
          v{packageJson.version}
        </Footer>
      </Modal>
    </Root>
  );
}
