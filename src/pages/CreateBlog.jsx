// src/pages/CreateBlog.jsx
import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

const Blogs = collection(db, "Blogs");

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // popover
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // compute fixed popover position when avatar toggles open
  useEffect(() => {
    if (!avatarOpen) return;

    const el = avatarRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // position popover slightly below avatar, prefer right-aligned if space
    const top = rect.bottom + 10;
    const left = Math.min(window.innerWidth - 260 - 12, rect.right - 200); // ensure doesn't overflow right edge
    setPopoverPos({ top, left: Math.max(12, left) });

    const handleResize = () => {
      const r = el.getBoundingClientRect();
      const t = r.bottom + 10;
      const l = Math.min(window.innerWidth - 260 - 12, r.right - 200);
      setPopoverPos({ top: t, left: Math.max(12, l) });
    };

    const onDocClick = (e) => {
      if (!el.contains(e.target)) setAvatarOpen(false);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("click", onDocClick);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", onDocClick);
    };
  }, [avatarOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to create a blog");
      navigate("/login");
      return;
    }

    if (!title.trim() || !body.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await addDoc(Blogs, {
        title: title.trim(),
        body: body.trim(),
        published: false,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorEmail: user.email,
        createdAt: serverTimestamp(),
      });

      alert("Blog Created Successfully! 🎉");
      setTitle("");
      setBody("");
      navigate("/blogs");
    } catch (error) {
      alert("Error creating blog. Please try again.");
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl max-w-md">
          <svg className="w-16 h-16 mx-auto text-sky-600 dark:text-sky-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You need to be logged in to create a blog post</p>
          <div className="flex gap-3 justify-center">
            <Link to="/login" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg transition font-medium">
              Login
            </Link>
            <Link to="/signup" className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-2 rounded-lg transition font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initial = (user.displayName || user.email || "U")[0].toUpperCase();

  // small motion configs
  const cardMotion = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 }, transition: { duration: 0.35 } };
  const popoverMotion = { initial: { opacity: 0, y: -6, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -6, scale: 0.98 }, transition: { duration: 0.18 } };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pb-16">
      {/* header — subtle glass with animated blobs */}
      <div className="relative overflow-visible py-12">
        <motion.div
          className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
          {...cardMotion}
        >
          <div className="bg-white/60 dark:bg-neutral-900/50 backdrop-blur-md border border-white/30 dark:border-white/6 rounded-2xl p-6 md:p-8 flex items-center justify-between gap-6 shadow-sm">
            <div>
              <motion.h1 layout className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                Create your story
              </motion.h1>
              <motion.p layout className="mt-1 text-sm text-gray-600 dark:text-gray-300 max-w-xl">
                Capture your ideas — write, save drafts and publish when ready.
              </motion.p>
            </div>

            {/* Avatar button */}
            <div className="relative" ref={avatarRef}>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setAvatarOpen((v) => !v);
                }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 p-1.5 ring-1 ring-white/30 shadow-md focus:outline-none"
                aria-expanded={avatarOpen}
              >
                <motion.div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white font-semibold text-lg">
                  {initial}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Popover (fixed to avoid clipping) */}
      <AnimatePresence>
        {avatarOpen && (
          <motion.div
            key="avatar-pop"
            initial={popoverMotion.initial}
            animate={popoverMotion.animate}
            exit={popoverMotion.exit}
            transition={popoverMotion.transition}
            style={{ top: popoverPos.top, left: popoverPos.left }}
            className="fixed z-[2000] w-64"
          >
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.displayName || "Anonymous"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              <div className="mt-3 border-t border-gray-100 dark:border-gray-700 pt-2 flex flex-col gap-2">
                <Link to="/profile" onClick={() => setAvatarOpen(false)} className="text-sm text-sky-600 hover:underline">View Profile</Link>
                <button
                  onClick={() => {
                    auth.signOut();
                    setAvatarOpen(false);
                    navigate("/");
                  }}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 text-left"
                >
                  Sign out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* main form area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div layout {...cardMotion} className="rounded-3xl p-1" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04) 30%, rgba(139,92,246,0.03))" }}>
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-white/30 dark:border-white/6">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <motion.h2 layout className="text-lg font-semibold text-gray-900 dark:text-white">New Blog</motion.h2>
                  <motion.p layout className="text-sm text-gray-500 dark:text-gray-400">Your draft will be kept safely until you publish.</motion.p>
                </div>
                <motion.span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">{body.length} chars</motion.span>
              </div>

              {/* Title */}
              <div className="mb-5">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Blog Title</label>
                <motion.input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition text-lg shadow-sm"
                  placeholder="Enter an engaging title..."
                  required
                  whileFocus={{ scale: 1.01 }}
                />
              </div>

              {/* Body */}
              <div className="mb-6">
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                <motion.textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                  className="w-full px-5 py-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition resize-none shadow-inner"
                  placeholder="Write your story here..."
                  required
                  whileFocus={{ scale: 1.01 }}
                />
              </div>

              {/* controls */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div className="flex gap-3 w-full sm:w-auto">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-none bg-gradient-to-br from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                    whileHover={{ translateY: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Blog
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => navigate("/blogs")}
                    className="bg-white/50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium py-3 px-5 rounded-xl transition border border-gray-100 dark:border-gray-700 shadow-sm"
                    whileHover={{ translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Draft will be saved automatically • <span className="text-gray-700 dark:text-gray-200">You can publish later</span>
                </div>
              </div>
            </form>

            {/* Tips / footer */}
            <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-gray-900 dark:to-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707" />
                </svg>
                Writing Tips
              </h3>
              <ul className="text-gray-700 dark:text-gray-300 text-sm grid gap-2 sm:grid-cols-2">
                <li className="flex items-start gap-2"><span className="text-sky-600 mt-0.5">•</span><span>Use a catchy title</span></li>
                <li className="flex items-start gap-2"><span className="text-sky-600 mt-0.5">•</span><span>Break into paragraphs</span></li>
                <li className="flex items-start gap-2"><span className="text-sky-600 mt-0.5">•</span><span>Draft saved automatically</span></li>
                <li className="flex items-start gap-2"><span className="text-sky-600 mt-0.5">•</span><span>Edit or publish later</span></li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* quick links */}
        <div className="mt-8 flex justify-center gap-4 text-sm">
          <Link to="/blogs" className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            View All Blogs
          </Link>
          <span className="text-gray-400">•</span>
          <Link to="/" className="text-sky-600 dark:text-sky-400 hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
