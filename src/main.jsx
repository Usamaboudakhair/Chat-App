import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContext, AuthContextprovider } from './context/AuthContext.jsx'
import { ChatContextprovider } from './context/ChatContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextprovider>
    <ChatContextprovider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ChatContextprovider>
  </AuthContextprovider>
)
