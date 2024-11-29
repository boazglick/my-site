"use client";

import { useParams } from "next/navigation";

export default function ImagePage() {
  const { id } = useParams(); // The file ID passed from the URL
  const imageUrl = `https://drive.google.com/uc?id=${id}`;

  return (
    <div>
      <h1>Image Viewer</h1>
      <img src={imageUrl} alt="Shoe Image" style={{ maxWidth: "100%", height: "auto" }} />
      <a href="/">Back to Home</a>
    </div>
  );
}
