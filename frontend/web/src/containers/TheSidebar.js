import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CImg
} from '@coreui/react'
// sidebar nav config
import navigation from './_nav'
import Logo3 from "../assets/logos/logo3.png";
import Logo2 from "../assets/logos/logo2.png";

const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)

  return (
    
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
    >
      {/* Phần logo của web*/}
      <CSidebarBrand className="d-md-down-none" to="/">
        <CImg src={Logo3} width={110} className="c-sidebar-brand-full" />
        <CImg src={Logo2} width={30} className="c-sidebar-brand-minimized" />
      </CSidebarBrand>
      {/* Navbar của web */}
      <CSidebarNav>
        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none"/>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
