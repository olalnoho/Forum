import React, { useState, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { GlobalContext } from '../../../context/Global'

const loginMutation = gql`
   mutation LoginUser($email: String! $password: String!) {
      login(data: {email: $email password: $password})
   }
`
const Login = (props) => {
   const { isAuth, setIsAuth } = useContext(GlobalContext)
   const [formData, setFormData] = useState({
      email: '',
      password: ''
   })
   const [login, { data, error }] = useMutation(loginMutation, {
      variables: { email: formData.email, password: formData.password }
   })

   if (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('isAuth')
      setIsAuth(false)
   }

   if (data) {
      localStorage.setItem('token', data.login)
      localStorage.setItem('isAuth', true)
      setIsAuth(true)
   }

   if (isAuth) {
      if (props.location.state.includes('thread')) {
         props.history.goBack()
      }
      return <Redirect to="/" />
   }
   return (
      <div className="container">
         <div className="login">
            {error && <div className="login__error">
               {error.graphQLErrors.map(err => {
                  return err.message
               })}
            </div>}
            <div className="login__actions">
               <h2 className="heading--2" > Login </h2>
               <form className="form" onSubmit={e => {
                  e.preventDefault()
                  login()
               }}>
                  <input
                     onChange={e => setFormData({ ...formData, email: e.target.value })}
                     type="text"
                     value={formData.email}
                     placeholder="Email" />
                  <input
                     onChange={e => setFormData({ ...formData, password: e.target.value })}
                     type="password" placeholder="Password"
                     value={formData.password} />
                  <input className="btn btn-primary" type="submit" placeholder="Login" />
               </form>
            </div>
         </div>
      </div>
   )
}

export default Login
