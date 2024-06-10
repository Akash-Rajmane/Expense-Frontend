import React from 'react'

const MenuIcon = ({className,onClick}) => {
  return (
    <svg width="30px" height="30px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#208dd2" className={className} onClick={onClick}>
      <path fill="#208dd2" fillRule="evenodd" d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"/>
    </svg>
  )
}

export default MenuIcon



