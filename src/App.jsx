// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateBlog from "./pages/CreateBlog";
import Bloglist from "./pages/Bloglist";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <div>
      <Navbar/>
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Bloglist />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/create" element={ <RequireAuth><CreateBlog /> </RequireAuth>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}