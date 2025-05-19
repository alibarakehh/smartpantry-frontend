

import React, {useState} from 'react';
//import Navbar from './Navbar';
//import Sidebar from '../components/Sidebar';
import './footer.css'; 
const Footer = () => {
        const [isOpen, setIsOpen] = useState(false)
        const toggle = () => {
          setIsOpen(!isOpen)
        }
  return (
    <footer>
        
      {/* Your footer content goes here */}
      <p>&copy; 2025 | Ali El Rida Barakeh - Jamil Nakhle - Rami Moussali - Michelle Metni</p>
    </footer>
  );
};

export default Footer;
