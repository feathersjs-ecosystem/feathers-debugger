import React from 'react';
import stc from 'string-to-color';
import styled from 'styled-components';

const Root = styled.div`
  padding: 8px 0;
  display: flex;
  border-bottom: 1px solid #eee;
  &:hover {
    background: rgba(0, 30, 255, 0.05);
    cursor: pointer;
  }
`;

const DurationBar = styled.div`
  height: 3px;
  transition: width 0.5s;
`;

const Item = styled.div`
  font-size: 11.5px;
  color: #333;
  small {
    opacity: 0.5;
  }
  white-space: nowrap;
`;

const Method = styled.div`
  display: inline-block;
  line-height: 1.2;
  margin-top: 2px;
  margin-left: 2px;
  background: #f96e46;
  color: white;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 1px 5px;
  font-size: 9px;
  font-weight: bold;
  margin-right: 8px;
  ${(p) => p.method === 'get' && `background: #EDB007;`}
  ${(p) => p.method === 'create' && `background: #57467B;`}
`;

const Gap = styled.div`
  transition: width 0.3s;
  animation: fadeIn 1s;
`;

export default function WaterfallItem({
  item,
  zoomFactor,
  start,
  previousItem,
}) {
  return (
    <Root>
      <Gap style={{ width: (item.ts - start) * zoomFactor }} />
      <Item>
        <DurationBar
          style={{
            width: item.duration * zoomFactor,
            background: stc(item.path),
          }}
        />
        <Method method={item.method}>{item.method}</Method>
        {item.path} {item.duration}ms{' '}
        {previousItem && <small>+{item.ts - previousItem.ts}ms</small>}
      </Item>
    </Root>
  );
}
