import React, { useState, createContext } from 'react'

export const GlobalContext = createContext()

export const GlobalProvider = props => {
   const [isAuth, setIsAuth] = useState(false)
   const [page, setPage] = useState(0)
   return (
      <GlobalContext.Provider value={{ isAuth, setIsAuth, page, setPage }}>
         {props.children}
      </GlobalContext.Provider>
   )
}