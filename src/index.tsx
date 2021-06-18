import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Windmill } from '@windmill/react-ui';

ReactDOM.render(
  <Windmill
    dark
    theme={{
      button: {
        primary: {
          base: 'text-white bg-gray-600 border border-transparent',
          active:
            'active:bg-gray-600 hover:bg-gray-700 focus:ring focus:ring-gray-300',
          disabled: 'opacity-50 cursor-not-allowed',
        },
      },
    }}
  >
    <App />
  </Windmill>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
