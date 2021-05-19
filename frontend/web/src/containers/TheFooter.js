import React from 'react'
import { CFooter } from '@coreui/react'

/**
 * Component footer cho web
 * @returns 
 */
const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">goFAST</a>
        <span className="ml-1">&copy; 2021 MTHUNG.</span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">goFAST for Admin</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
