"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const { id } = useParams(); // The folder ID passed from the URL
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const apiKey = "AIzaSyDtQcbLJO5wYNBcAjsvBTkyespCa57RHmU";
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${id}'+in+parents&key=${apiKey}`
      );
      const data = await response.json();
      setItems(data.files);
    };

    fetchItems();
  }, [id]);

  return (
    <div>
      <h1>Category</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.mimeType === "application/vnd.google-apps.folder" ? (
              <a href={`/category/${item.id}`}>{item.name}</a>
            ) : (
              <a href={`/image/${item.id}`}>{item.name}</a>
            )}
          </li>
        ))}
      </ul>
      <a href="/">Back to Home</a>
    </div>
  );
}
