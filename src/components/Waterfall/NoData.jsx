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

export default function NoData({ error, port }) {
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
            <a href={`http://localhost:${port}/feathers-debugger`}>
              http://localhost:{port}/feathers-debugger
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
          Make sure you installed Feathers Debugger hook in{' '}
          <code>app.hooks</code>.
          <br />
          Read documentation{' '}
          <a
            href="http://github.com/radenkovic/feathers-debugger"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>{' '}
          on how to configure FeathersJS Debugger.
        </p>
      </div>
    </Root>
  );
}
