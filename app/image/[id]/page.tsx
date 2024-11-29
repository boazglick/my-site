"use client";

import { useParams } from "next/navigation";

export default function ImagePage() {
  const { id } = useParams(); // The file ID passed from the URL
  const iframeUrl = `https://drive.google.com/file/d/${id}/preview`; // Using Google Drive's embed preview link

  return (
    <div>
      <h1>Image Viewer</h1>
      <iframe
        src={iframeUrl}
        title="Shoe Image"
        width="600"
        height="400"
        style={{ border: "none" }}
        allowFullScreen
      ></iframe>
      <a href="/">Back to Home</a>
    </div>
  );
}
