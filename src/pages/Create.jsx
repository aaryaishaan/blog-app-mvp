import React from 'react'
import fb from '../firebase';
 db = fb.firestore()
const Blogs = db.collection('blogs');

const Create = () => {
  return (
    <div>Create</div>
  )
}

export default Create