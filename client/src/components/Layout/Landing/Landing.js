import React, { useState, useEffect, useContext } from 'react'
import { GlobalContext } from '../../../context/Global'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { Link } from 'react-router-dom'

export const getThreads = gql`
query GetThreads($skip: Int, $limit: Int){
  topics {
     totalThreads,
     title,
     id,
     threads(skip: $skip, limit: $limit) {
        title
        id
        postCount
        by {
           name
        }
     }
  }
}
`

const Landing = (props) => {
   let limit = 15
   const [pageNumber, setPageNumber] = useState(0)
   const { isAuth, page, setPage } = useContext(GlobalContext)
   const { loading, error, data } = useQuery(getThreads, { variables: { limit, skip: limit * pageNumber }, fetchPolicy: "cache-first" });
   const [active, setActive] = useState({})

   useEffect(() => {
      !loading && setActive(data.topics[page])
   }, [loading, data, page])

   if (error) {
      return <div>Something went wrong..</div>
   }
   const paginate = () => {
      return <div className="landing__paginate">
         <i className="landing__paginate--prev fas fa-arrow-left" onClick={e => {
            limit * pageNumber + 1 > limit && setPageNumber(pageNumber - 1)
         }}></i>
         <p><span className="hide-if-small">Page </span>{`${pageNumber + 1} of ${Math.ceil(active.totalThreads / limit)}`}</p>
         <i className="landing__paginate--next fas fa-arrow-right" onClick={e => limit * (pageNumber + 1) < active.totalThreads && setPageNumber(pageNumber + 1)}></i>
      </div>
   }

   return (
      <div className="container">
         <div className="landing">
            <div className="landing__title">
               <h1 className="heading--1 big"> Forum index page</h1>
               <p className="medium hide-if-small">Select a category and browse some threads.</p>
            </div>
            <div className="landing__categories">
               {!loading && data && data.topics.map((cat, i) => <h3 onClick={e => {
                  setPageNumber(0)
                  setPage(i)
                  setActive(cat)
               }} key={cat.title}> {cat.title} </h3>)}
            </div>
            {!loading && <table className="landing__threads">
               <thead>
                  <tr>
                     <th>Title</th>
                     <th>Posts</th>
                     <th>Created By</th>
                  </tr>
               </thead>
               {active && active.threads && <tbody>
                  {active.threads.map((th, i) => {
                     return <tr key={i} className="landing__threads--item">
                        <td><Link to={`/threads/${th.id}`}>{th.title} </Link></td>
                        <td className="posts"> {th.postCount} </td>
                        <td>{th.by.name}</td>
                     </tr>
                  })}
               </tbody>}
            </table>}
            {active.threads && active.threads.length === 0 && <p className="medium no_thread"> No threads yet</p>}
            {!loading && <div className="landing__create">
               {paginate()}
               {isAuth && active ? <Link to={`/threads/create/${active.id}`} className="btn btn-primary"> Create thread in '{active.title}' </Link>
                  : <p> Login if you want to create a thread! </p>}
            </div>}
         </div>
      </div>
   )
}

export default Landing