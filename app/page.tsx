"use client";

import { useEffect, useState } from "react";

// Define a TypeScript interface for categories
interface Category {
  id: string;
  name: string;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const apiKey = "AIzaSyDtQcbLJO5wYNBcAjsvBTkyespCa57RHmU";
      const folderId = "1--jkUTbUNvCgFgExpoyHWsJQo-wyAHl4"; // Replace with your root folder ID
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}`
      );
      const data = await response.json();
      setCategories(data.files || []); // Ensure files exist in the response
    };

    fetchCategories();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      {/* Logo */}
      <img
        src="/logo.png" // Replace with your actual logo file path
        alt="Kavkav logo"
        style={{ maxWidth: "200px", marginBottom: "2rem" }}
      />

      {/* Buttons for categories */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            style={{
              padding: "1rem",
              fontSize: "1rem",
              background: "#add8e6", // Light blue background
              border: "1px solid #ccc",
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => (window.location.href = `/category/${category.id}`)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
