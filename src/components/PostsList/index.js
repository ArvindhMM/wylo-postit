import React, { useState, useEffect } from 'react';
import PostItem from '../PostItem';
import './index.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');


  //useEffect get posts array in local storage and set it to the posts array state when the component mounts
  useEffect(() => {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts && storedPosts !== 'null') {
      const parsedPosts = JSON.parse(storedPosts);
      setPosts(parsedPosts);
    }
    setIsInitialized(true);
  }, []);

  //useEffect to store the posts array in local storage when the post array changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('posts', JSON.stringify(posts));
    }
  }, [posts, isInitialized]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [editingPost, setEditingPost] = useState(null);



  const [affirmationMessage, setAffirmationMessage] = useState('');
  const [showAffirmation, setShowAffirmation] = useState(false);

  //open modal to create and edit posts
  const openModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setCategory(post.category);
      setDescription(post.description);
    } else {
      setEditingPost(null);
      setTitle('');
      setCategory('');
      setDescription('');
    }
    setIsModalOpen(true);
  };


  //set title and description to empty string and close modal 
  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setCategory('');
    setDescription('');
  };


  //Handle sumit and create and edit posts
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPost) {
      setPosts(posts.map(post => post.id === editingPost.id ? { ...post, title,category, description } : post));
      setAffirmationMessage('Post updated successfully!'); //Affirmation message when post is updated
    } else {
      const newPost = {
        id: Date.now(),
        title,
        category,
        description,
      };
      setPosts([...posts, newPost]);
      setAffirmationMessage('Post created successfully!'); //Affirmation message when post is created
    }
    setShowAffirmation(true);
    closeModal();

    //timer to show affirmation message
    setTimeout(() => {
      setShowAffirmation(false);
      setAffirmationMessage('');
    }, 1000);
  };

  //delete post 
  const deletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  //categories
  const categories = [ 'Personal','Work','Health', 'Others']; 
  //filter posts based on selected category, default is All
  const filteredPosts = selectedCategory === 'All' ? posts : posts.filter(post => post.category === selectedCategory);

  return (
    <main className='content-container'>
      <section className='categories-filter-container'>
      <label htmlFor="filter" className='categories-filter-label'>Category : </label>
      <select
      id="filter"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className='categories-filter'
      >
        <option value="All">All</option>
        {categories.map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
      </select>
      </section>
      <section className="post-list">
        {filteredPosts.length === 0 ? (
          <p className="no-posts">Nothing here yet. <br />Create a post to fill this space!</p>
        ) : (
          filteredPosts.map(post => (
            <PostItem key={post.id} post={post} onDelete={deletePost} onEdit={openModal}/>
          ))
        )}
      </section>
      <section className="new-post">
        <button onClick={() => openModal()}>+ New Post</button>
      </section>
     { /*Create and edit posts modal */}
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
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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
      { /*Affirmation message modal when post is created or updated*/}
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
