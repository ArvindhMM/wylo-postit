import React from 'react';
import { TiDeleteOutline } from "react-icons/ti";
import { FiEdit } from "react-icons/fi";
import './index.css';

function PostItem({ post, onDelete, onEdit }) {
  return (
    <article className="post-item">
        <div  className="post-buttons"> 
            <button  className='edit' onClick={() => onEdit(post)}><FiEdit /></button>
            <button onClick={() => onDelete(post.id)}><TiDeleteOutline /></button>
        </div>
      <h3 className='title'>{post.title}</h3>
      <p className='description'>{post.description}</p>
      
    </article>
  );
}

export default PostItem;