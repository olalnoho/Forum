import React, { useContext } from 'react'
import { GlobalContext } from '../../../context/Global'
import { Link, withRouter } from 'react-router-dom'
const Header = (props) => {

   const { isAuth, setIsAuth } = useContext(GlobalContext)
   const AuthLinks = (
      <ul className="nav__list">
         <li className="nav__list--item"><Link to="/">Home</Link></li>
         <li className="nav__list--item"><a onClick={e => {
            localStorage.removeItem('token')
            localStorage.removeItem('isAuth')
            setIsAuth(false)
         }} href="#!">Logout</a></li>
      </ul>
   )

   const GuestLinks = (
      <ul className="nav__list">
         <li className="nav__list--item"><Link to="/">Home</Link></li>
         <li className="nav__list--item"><Link to="/register">Register</Link></li>
         <li className="nav__list--item"><Link to={{
            pathname: "/login",
            state: props.location.pathname
         }}>Login</Link></li>
      </ul>
   )

   return (
      <header className="header">
         <h2 className="heading--2">
            <i className="fab fa-500px"></i>
            <Link to="/">Forum</Link>
         </h2>
         <nav className="nav">
            {isAuth ? AuthLinks : GuestLinks}
         </nav>
      </header>
   )
}

export default withRouter(Header)
