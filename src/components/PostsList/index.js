import React, { useState, useEffect } from 'react';
import PostItem from '../PostItem';
import './index.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts && storedPosts !== 'null') {
      const parsedPosts = JSON.parse(storedPosts);
      setPosts(parsedPosts);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('posts', JSON.stringify(posts));
    }
  }, [posts, isInitialized]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingPost, setEditingPost] = useState(null);

  const [affirmationMessage, setAffirmationMessage] = useState('');
  const [showAffirmation, setShowAffirmation] = useState(false);

  const openModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setDescription(post.description);
    } else {
      setEditingPost(null);
      setTitle('');
      setDescription('');
    }
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPost) {
      setPosts(posts.map(post => post.id === editingPost.id ? { ...post, title, description } : post));
      setAffirmationMessage('Post updated successfully!');
    } else {
      const newPost = {
        id: Date.now(),
        title,
        description,
      };
      setPosts([...posts, newPost]);
      setAffirmationMessage('Post created successfully!');
    }
    setShowAffirmation(true);
    closeModal();

    setTimeout(() => {
      setShowAffirmation(false);
      setAffirmationMessage('');
    }, 1000);
  };

  const deletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <main className='content-container'>
      <section className="post-list">
        {posts.length === 0 ? (
          <p className="no-posts">Nothing here yet. <br />Create a post to fill this space!</p>
        ) : (
          posts.map(post => (
            <PostItem key={post.id} post={post} onDelete={deletePost} onEdit={openModal}/>
          ))
        )}
      </section>
      <section className="new-post">
        <button onClick={() => openModal()}>+ New Post</button>
      </section>
      {isModalOpen && (
        <div className='modal-container'>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal">
            <form onSubmit={handleSubmit}>
              <label htmlFor="title">Post Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder='Title'
              />
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="12"
                cols="50"
                placeholder='Description ....'
              ></textarea>
              <div className='form-buttons'>
                <button type="submit" >Submit</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAffirmation && (
        <div className='affirmation-modal-container'>
          <div className="affirmation-modal-overlay"></div>
          <div className='affirmation-modal'>
            <p>{affirmationMessage}</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default PostList;
