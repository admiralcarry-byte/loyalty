import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/authDebug' // Import auth debug utility

createRoot(document.getElementById("root")!).render(<App />);
