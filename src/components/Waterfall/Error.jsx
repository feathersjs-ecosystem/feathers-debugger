import React from 'react';
import styled from 'styled-components';
import { ErrorColor } from '../../assets';

const Root = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: 50px;
`;

export default function NoData() {
  return (
    <Root>
      <div>
        <ErrorColor />
      </div>
    </Root>
  );
}
