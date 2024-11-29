"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const { id } = useParams(); // Folder ID from URL
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const apiKey = "AIzaSyDtQcbLJO5wYNBcAjsvBTkyespCa57RHmU"; // Replace with your actual API key
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${id}'+in+parents&fields=files(id,name,mimeType,thumbnailLink)&key=${apiKey}`
      );
      const data = await response.json();
      setItems(data.files);
    };

    fetchItems();
  }, [id]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ textAlign: "center" }}>Category</h1>
      <div style={{ display: "grid", gap: "1rem" }}>
        {/* Display folders as buttons */}
        {items
          .filter((item) => item.mimeType === "application/vnd.google-apps.folder")
          .map((folder) => (
            <button
              key={folder.id}
              style={{
                display: "block",
                width: "100%",
                padding: "1rem",
                textAlign: "center",
                background: "#f0f0f0",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
              onClick={() => (window.location.href = `/category/${folder.id}`)}
            >
              {folder.name}
            </button>
          ))}

        {/* Display images with thumbnails */}
        {items
          .filter((item) => item.mimeType !== "application/vnd.google-apps.folder")
          .map((image) => (
            <div
              key={image.id}
              style={{
                textAlign: "center",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <a href={`/image/${image.id}`}>
                <img
                  src={image.thumbnailLink || "/placeholder.png"} // Fallback thumbnail
                  alt={image.name}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    marginBottom: "0.5rem",
                  }}
                />
                <p>{image.name}</p>
              </a>
            </div>
          ))}
      </div>
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <a href="/" style={{ textDecoration: "none", color: "blue" }}>
          Back to Home
        </a>
      </div>
    </div>
  );
}
