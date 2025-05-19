
import {useLocation, useNavigate} from 'react-router-dom';

import React from 'react'
import './../css/home.css'
import HomeElements from '../components/Home'



const Home = () => {

  const navigate = useNavigate();

  const handleButtonClick = () => {
    // Navigate to the 'shuffle' page
    navigate('/shuffle');
  };

  const navigate1 = useNavigate();

  const handleButtonClick1 = () => {
    // Navigate to the 'shuffle' page
    navigate1('/SearchView');
  };

  return (
    <>
    <section className='home-container-1'>
      <div className='title'>
        {/* <p>Recipe-X
          
        </p> */}

        <p class="homepage-quote">Every recipe tells a story, and every meal is an opportunity to create a new chapter.</p>
       <button className="buttonSearch" onClick={handleButtonClick1}>
            Click here to find yours!</button>
      </div>
      
    </section>
    <section className='home-container-2'>
  <div className='box'>
    <p className='box-content'>Feeling a bit indecisive about what to cook? Click our shuffle <br></br> button,and let the magic of 
    randomness surprise you<br></br> with a recipe suggestion.</p>
    <button className="box-button" onClick={handleButtonClick}>
      Choose randomly
    </button>
  </div>
</section>

    </>
  )
}

export default Home

