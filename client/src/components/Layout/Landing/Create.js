import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'
import { getThreads } from '../Landing/Landing'


const createThread = gql`
mutation Create($title: String! $content: String! $topic: ID!) {
  createThread(data: { 
    title: $title 
    content: $content
    topic: $topic
  }) {
    id
    topic {
       id
       totalThreads
    }
  }
}


`
const Create = props => {
   const [formData, setFormData] = useState({
      title: '',
      content: ''
   })
   const [create, { data }] = useMutation(createThread, {
      variables: {
         topic: props.match.params.id,
         title: formData.title,
         content: formData.content
      }, refetchQueries: () => {
         return [{ query: getThreads, variables: { skip: 0, limit: 15 } }]
      }, awaitRefetchQueries: true
   })

   if (data) {
      return <Redirect to={`/threads/${data.createThread.id}`} />
   }
   return (
      <div className="container">
         <div className="landing">
            <p className="landing__back" onClick={props.history.goBack}>Go back</p>
            <form className="form" onSubmit={e => {
               e.preventDefault()
               create()
            }}>
               <label><strong>Thread Title</strong></label>
               <input className="landing__input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} type="text" />
               <label>
                  <strong>Message:</strong>
               </label>
               <textarea
                  className="landing__input"
                  value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}
                  cols="30" rows="30" />
               <input type="submit" className="btn btn-primary" />
            </form>
         </div>
      </div>
   )
}

export default Create
