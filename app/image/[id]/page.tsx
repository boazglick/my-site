"use client";

import { useParams } from "next/navigation";

export default function ImagePage() {
  const { id } = useParams(); // The file ID passed from the URL
  const iframeUrl = `https://drive.google.com/file/d/${id}/preview`; // Using Google Drive's embed preview link

  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      <h1>Image Viewer</h1>
      <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%" }}>
        <iframe
          src={iframeUrl}
          title="Shoe Image"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allowFullScreen
        ></iframe>
      </div>
      <a href="/">Back to Home</a>
    </div>
  );
}
