import React from 'react';
import stc from 'string-to-color';
import styled from 'styled-components';
import ms from 'ms';

const Root = styled.div`
  padding: 4px 0;
  &:first-child {
    margin-top: 2px;
  }
  padding-top: 0;
  display: flex;
  border-bottom: 1px solid ${p => p.theme.border};
  transition: 0.3s background;
  &:hover {
    background: ${p => p.theme.background};
    cursor: pointer;
  }
  &:active {
    * {
      color: white;
    }
    background: ${p => p.theme.primary};
  }
`;

const DurationBar = styled.div`
  height: 3px;
  transform: translateY(-2px);
  transition: width 0.3s;
`;

const Item = styled.div`
  font-size: 11.5px;
  color: #333;
  small {
    opacity: 0.5;
  }
  white-space: nowrap;
`;

const Duration = styled.div`
  margin: 0 5px;
  font-weight: bold;
  display: inline-block;
`;

const Method = styled.div`
  display: inline-block;
  line-height: 1.2;
  color: #0631ef;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 9px;
  font-weight: bold;
  margin-right: 5px;
  ${p =>
    p.method &&
    `color: ${p.theme.methods[p.method] || p.theme.methods.default};`}
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
  condensed,
  index,
}) {
  let prevOffset = 0;
  if (previousItem && previousItem.end <= item.ts) {
    prevOffset = item.ts - previousItem.end;
  } else if (previousItem && previousItem.end > item.ts) {
    prevOffset = item.ts - previousItem.ts;
  }

  let gapWidth = (item.ts - start) * zoomFactor;
  if (condensed) {
    gapWidth = index * 10;
  }

  const color = stc(item.path);
  return (
    <Root>
      <Gap style={{ width: gapWidth }} />
      <Item>
        <DurationBar
          style={{
            width: item.duration * zoomFactor,
            background: color,
          }}
        />
        <Method method={item.method}>{item.method}</Method>
        {item.path}
        <Duration style={{ color }}>{item.duration}ms</Duration>
        {previousItem && <small>+{ms(prevOffset)}</small>}
      </Item>
    </Root>
  );
}
