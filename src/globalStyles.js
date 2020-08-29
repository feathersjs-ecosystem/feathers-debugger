import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyle = createGlobalStyle`
  #app {
    display: flex;
    height: 100vh;
    flex-direction: column;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
    line-height: 1.5;
    color: ${theme.text};
    font-size: 16px;
  }

  * {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
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
    border: 0;
    margin: 0;
    background: none;
    padding: 5px;
    color: ${theme.light};
  }
  
  input {
    color: ${theme.text};
  }
  
  .tooltip {
    font-size: 12px;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  }
  
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  ::-webkit-scrollbar-track {
    background: ${theme.background};
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
`;

export default GlobalStyle;
