import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ContextProvider } from './contexts/ContextProvider.jsx'
import router from './router.jsx'
import './index.css'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </ConfigProvider>
  </React.StrictMode>,
)
