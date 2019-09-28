import React, { useState, useContext } from 'react'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'
import { GlobalContext } from '../../../context/Global'

const registerUser = gql`
   mutation CreateUser($name: String $email: String! $password: String!){
      createUser(data: {name: $name email: $email password: $password})
   }
`

const Register = () => {
   const { isAuth, setIsAuth } = useContext(GlobalContext)
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
   })
   const [register, { data, error }] = useMutation(registerUser, {
      variables: { ...formData }
   })

   if (isAuth) {
      return <Redirect to="/" />
   }

   if (data) {
      localStorage.setItem('token', data.createUser)
      localStorage.setItem('isAuth', true)
      setIsAuth(true)
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
               <h2 className="heading--2">Register</h2>
               <form className="form" onSubmit={e => {
                  e.preventDefault()
                  register()
               }}>
                  <input onChange={e => setFormData({ ...formData, name: e.target.value })} value={formData.name} placeholder="Name" type="text" />
                  <input onChange={e => setFormData({ ...formData, email: e.target.value })} value={formData.email} placeholder="Email" type="text" />
                  <input onChange={e => setFormData({ ...formData, password: e.target.value })} value={formData.password} placeholder="Password" type="password" />
                  <input className="btn btn-primary" value="Register" type="submit" />
               </form>
            </div>
         </div>
      </div>
   )
}

export default Register
