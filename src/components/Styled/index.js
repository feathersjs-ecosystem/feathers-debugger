import styled, { css } from 'styled-components';

export const BtnGroup = styled.div`
  display: flex;
  align-items: center;
  margin: 0 5px;
  button {
    margin: 0;
    border-radius: 0;
    border-right: 0;
    &:first-child {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }
    &:last-child {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      border-right: 1px solid ${p => p.theme.border};
    }
  }
`;

export const Btn = styled.button`
  border: 1px solid ${p => p.theme.border};
  color: ${p => p.theme.text};
  background: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  border-radius: 6px;
  min-width: 26px;
  padding: 0 8px;
  flex-shrink: 0;
  height: 35px;
  font-size: 10.5px;
  &:hover {
    background: ${p => p.theme.background};
    svg {
      fill: ${p => p.theme.primary};
    }
  }
  &:active {
    background: ${p => p.theme.primary};
    color: white;
    svg {
      fill: #fff;
    }
  }
  ${p =>
    p.active === true &&
    css`
      background: ${x => x.theme.primary} !important;
      color: white;
      display: block;

      svg,
      path {
        fill: #fff;
      }
    `}
  svg {
    opacity: 0.8;
    width: 15px;
    height: 15px;
  }
`;
