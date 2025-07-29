import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div>
        404 - Page Not Found<br/>
        <Link to={'/'}>
          <button>Go Back Home</button>
        </Link>
    </div>
  )
}

export default NotFound