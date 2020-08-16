import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyle = createGlobalStyle`
  #app {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    line-height: 1.5;
    color: ${theme.text};
    font-size: 16px;
  }
  a {
    color: ${theme.primary};
    text-decoration: none;
    border-bottom: 1px dotted ${theme.primary};
  }
  code {
    font-family: sans-serif;
    background: ${theme.background};
    padding: 0 5px;
    border-radius: 6px;
    color: ${theme.primary};
  }
  button {
    outline: 0;
    cursor: pointer;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
`;

export default GlobalStyle;
