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
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <a href={`/category/${category.id}`}>{category.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
