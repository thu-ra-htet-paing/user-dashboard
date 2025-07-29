import React, { useEffect } from 'react'
import { Link, Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import axiosClient from '../axios-client';

function DefaultLayout() {
  const {user, setUser, token, setToken, notification} = useStateContext();

  if (!token) {
    return <Navigate to={'/login'}/>
  }

  const onLogout = (e) => {
    e.preventDefault()
    axiosClient.post('/logout')
      .then( _ => {
        setUser({})
        setToken(null)
      })
  }

  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
        setUser(data)
      })
  }, [])

  return (
    <div id='defaultLayout'>
      <aside>
        <Link to={'/dashboard'}>Dashboard</Link>
        <Link to={'/users'}>Users</Link>
      </aside>

      <div className='content'>
          <header>
            <div>
              Header
            </div>
            <div>
              {user.name}
              <a href='#' onClick={onLogout} className='btn-logout'>Log out</a>
            </div>
          </header>
          <main>
            <Outlet/>
          </main>
      </div>

      { notification &&
        <div className="notification">
          {notification}
        </div>
      }

    </div>
  )
}

export default DefaultLayout