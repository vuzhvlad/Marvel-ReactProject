import React from 'react';
import App from './components/app/App';
import { createRoot } from "react-dom/client"

import './style/style.scss';

const root = createRoot(document.getElementById('root'));

root.render(
    <App />,
);

