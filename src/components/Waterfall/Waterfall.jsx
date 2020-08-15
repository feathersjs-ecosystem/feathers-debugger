import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import sortBy from 'lodash/sortBy';
import Zoom from '../../assets/zoom.svg';

const Btn = styled.button`
  color: ${(p) => p.theme.primary};
  border: 1px solid red;
  background: none;
  svg {
    width: 12px;
  }
`;

export default function Waterfall() {
  const [items, setItems] = useState([]);
  const [zoomFactor, setZoomFactor] = useState(1);
  const [timeframe, setTimeframe] = useState(5);

  useEffect(() => {
    fetch('http://localhost:3030/waterfall.txt')
      .then((res) => res.text())
      .then((res) => {
        const ARR = [];
        res.split('\n').forEach((item) => {
          if (!item) return;
          ARR.push(JSON.parse(item));
        });
        const sorted = sortBy(ARR, 'ts');
        const filtered = sorted.filter(
          (item) => item.ts > Date.now() - 1000 * 60 * timeframe
        );
        console.log('FILTER', filtered);

        setItems(filtered);
      });
  }, [timeframe]);

  return (
    <div>
      <Btn>
        <Zoom />
      </Btn>
      Waterfall1 Extension
    </div>
  );
}
