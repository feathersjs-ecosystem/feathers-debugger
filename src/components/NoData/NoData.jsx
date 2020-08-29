import React from 'react';
import styled from 'styled-components';
import { ErrorColor } from '../../assets';

const Root = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: 50px;
  flex-direction: column;
  text-align: center;
  h1 {
    font-size: 24px;
  }
`;

export default function NoData({ error, url, protocol }) {
  return (
    <Root>
      <div>
        {error && (
          <>
            <ErrorColor
              width={60}
              height={60}
              style={{ display: 'block', margin: 'auto', marginBottom: 10 }}
            />
          </>
        )}
        <h1>{error ? 'Error' : 'No Data'}</h1>
        {error === 'Failed to fetch' && (
          <p>
            Feathers debugger <strong>not found</strong> on{' '}
            <a
              href={`${protocol}://${url}/feathers-debugger`}
              target="_blank"
              rel="noreferrer"
            >
              {protocol}://{url}/feathers-debugger
            </a>
          </p>
        )}
        {error === 'version-not-supported' && (
          <p>
            <strong>Feathers Debugger extension is outdated.</strong>
            <br />
            Please update Feathers debugger extension and feathers debugger
            service.
          </p>
        )}
        <p>
          Make sure you installed and configured{' '}
          <a
            href="https://www.npmjs.com/package/feathers-debugger-service"
            target="_blank"
            rel="noreferrer"
          >
            Debugger Service
          </a>{' '}
          on your server.
          <br />
          Read documentation{' '}
          <a
            href="http://github.com/radenkovic/feathers-debugger"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>{' '}
          on how to configure Feathers debugger.
        </p>
      </div>
    </Root>
  );
}
