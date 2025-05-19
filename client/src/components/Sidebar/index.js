import React from 'react'
import {
    SidebarContainer,
    Icon,
    CloseIcon,
    SidebarWrapper,
    SidebarMenu,
    SidebarLink,
    SideBtnWrap,
    SidebarRoute
} from './SidebarElements'

const Sidebar = ({ isOpen, toggle }) => {
    return ( <
        SidebarContainer isOpen = { isOpen }
        onClick = { toggle } >
        <
        Icon onClick = { toggle } >
        <
        CloseIcon / >
        <
        /Icon> <
        SidebarWrapper >
        <
        SidebarMenu >

        <
        SidebarLink to = 'pantry'
        onClick = { toggle } > Contact Us < /SidebarLink>

        <
        /SidebarMenu> <
        SideBtnWrap >
        <
        SidebarRoute to = '/signin' > Sign In < /SidebarRoute> <
        /SideBtnWrap> <
        /SidebarWrapper> <
        /SidebarContainer>
    )
}

export default Sidebar