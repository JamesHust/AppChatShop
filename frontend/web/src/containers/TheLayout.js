import React, {useEffect} from 'react'
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'

/**
 * Bố cục giao diện web chính
 * @returns 
 */
const TheLayout = (props) => {
  const { history } = props;
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token){
      history.push('/login');
    }
  }, [history])
  return (
    <div className="c-app c-default-layout">
      <TheSidebar/>
      <div className="c-wrapper">
        <TheHeader/>
        <div className="c-body">
          <TheContent/>
        </div>
        <TheFooter/>
      </div>
    </div>
  )
}

export default TheLayout
