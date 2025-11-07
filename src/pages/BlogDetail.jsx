// src/pages/BlogDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const blogRef = doc(db, 'Blogs', id);
      const blogSnap = await getDoc(blogRef);
      
      if (blogSnap.exists()) {
        const blogData = { id: blogSnap.id, ...blogSnap.data() };
        setBlog(blogData);
        setEditTitle(blogData.title);
        setEditBody(blogData.body);
      } else {
        setError('Blog not found');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load blog');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'Blogs', id));
      alert('Blog deleted successfully');
      navigate('/blogs');
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!editTitle.trim() || !editBody.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSaving(true);

    try {
      const blogRef = doc(db, 'Blogs', id);
      await updateDoc(blogRef, {
        title: editTitle.trim(),
        body: editBody.trim(),
      });

      setBlog({ ...blog, title: editTitle, body: editBody });
      setIsEditing(false);
      alert('Blog updated successfully! 🎉');
    } catch (err) {
      console.error('Error updating blog:', err);
      alert('Failed to update blog. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    try {
      const blogRef = doc(db, 'Blogs', id);
      const newPublishedStatus = !blog.published;
      await updateDoc(blogRef, {
        published: newPublishedStatus,
      });

      setBlog({ ...blog, published: newPublishedStatus });
      alert(newPublishedStatus ? 'Blog published! 🎉' : 'Blog unpublished');
    } catch (err) {
      console.error('Error updating publish status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isAuthor = user && blog && user.uid === blog.authorId;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <svg className="w-20 h-20 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 text-lg mb-4">{error || 'Blog not found'}</p>
          <Link 
            to="/blogs"
            className="inline-block bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Edit Blog</h1>
          
          <form onSubmit={handleUpdate} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <label htmlFor="editTitle" className="block text-gray-900 dark:text-white text-lg font-semibold mb-2">
                Title
              </label>
              <input
                type="text"
                id="editTitle"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="editBody" className="block text-gray-900 dark:text-white text-lg font-semibold mb-2">
                Content
              </label>
              <textarea
                id="editBody"
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows="15"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(blog.title);
                  setEditBody(blog.body);
                }}
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium px-6 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/blogs')}
          className="flex items-center text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blogs
        </button>

        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-block text-sm px-4 py-1 rounded-full ${
            blog.published 
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
          }`}>
            {blog.published ? 'Published' : 'Draft'}
          </span>

          {/* Author Actions */}
          {isAuthor && (
            <div className="flex gap-2">
              <button
                onClick={handlePublishToggle}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm"
              >
                {blog.published ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {blog.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
              {blog.authorName ? blog.authorName[0].toUpperCase() : 'A'}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{blog.authorName || 'Anonymous'}</p>
              <p className="text-sm">{formatDate(blog.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed text-lg">
              {blog.body}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between items-center">
          <Link 
            to="/blogs"
            className="text-blue-700 dark:text-blue-400 hover:underline"
          >
            ← See all blogs
          </Link>
          {!isAuthor && (
            <Link 
              to="/create"
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Write a Blog
            </Link>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;