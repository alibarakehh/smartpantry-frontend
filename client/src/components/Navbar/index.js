import React from 'react'
import {FaBars} from 'react-icons/fa'
import { 
  Nav, 
  NavbarContainer, 
  NavLogo, 
  MobileIcon, 
  NavMenu, 
  NavItem, 
  NavLinks,
  NavBtn,
  NavBtnLink
} from './NavbarElements';

const Navbar = ({toggle}) => {
  return (
    <>
      <Nav>
        <NavbarContainer>
            <NavLogo to='/'>Smart Pantry</NavLogo>
            <MobileIcon onClick={toggle}>
              <FaBars />
            </MobileIcon>
            <NavMenu>
              
              <NavItem>
                <NavLinks to="aboutus">About Us</NavLinks>
              </NavItem>

              <NavItem>
                <NavLinks to="search">Search</NavLinks>
              </NavItem>

  
              <NavItem>
                <NavLinks to="pantry">My Pantry</NavLinks>
              </NavItem>
            </NavMenu>

        </NavbarContainer>
      </Nav>
    </>
  )
}

export default Navbar