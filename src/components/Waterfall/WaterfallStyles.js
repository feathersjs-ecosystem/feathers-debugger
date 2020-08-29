import styled from 'styled-components';
import { Btn, BtnGroup } from '../Styled';
import { ErrorTriangle } from '../../assets';

export { Btn, BtnGroup };

export const Root = styled.div`
  background: #fff;
  min-height: 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const Title = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
`;

export const Toolbar = styled.div`
  padding: 8px;
  border: 1px solid ${p => p.theme.border};
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom: 1px solid ${p => p.theme.border};
  .right {
    display: flex;
    align-items: center;
  }
`;

export const Container = styled.div`
  overflow-x: scroll;
  box-sizing: border-box;
  flex-grow: 1;
  margin-top: -2px;
`;

export const WaterfallItems = styled.div`
  display: inline-block;
  min-width: 100%;
  flex-grow: 1;
`;

export const ErrorIcon = styled(ErrorTriangle)`
  width: 15px;
  height: 15px;
  fill: ${p => p.theme.danger};
  margin: 0 10px;
`;
