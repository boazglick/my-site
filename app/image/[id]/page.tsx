"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ImagePage() {
  const { id } = useParams(); // The file ID passed from the URL
  const router = useRouter();
  const iframeUrl = `https://drive.google.com/file/d/${id}/preview`; // Using Google Drive's embed preview link
  const [imageName, setImageName] = useState("Loading...");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImageData = async () => {
      const apiKey = "AIzaSyDtQcbLJO5wYNBcAjsvBTkyespCa57RHmU"; // Replace with your actual API key
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${id}?fields=name,webContentLink&key=${apiKey}`
      );
      const data = await response.json();
      setImageName(data.name || "Image Viewer"); // Fallback if no name is returned
      setImageUrl(data.webContentLink || ""); // Set the image URL
    };

    fetchImageData();
  }, [id]);

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/972723969466?text=${encodeURIComponent(imageUrl)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div style={{ padding: "1rem" }}>
      {/* Dynamic title */}
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
        {imageName}
      </h1>

      {/* Responsive iframe */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          paddingBottom: "56.25%", // Aspect ratio for 16:9
        }}
      >
        <iframe
          src={iframeUrl}
          title={imageName}
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

      {/* Navigation buttons */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <button
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#5d5c5c",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>
        <button
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#5d5c5c",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
          onClick={() => router.back()}
        >
          Back to Previous Category
        </button>
      </div>

      {/* WhatsApp Share Button */}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button
          onClick={handleWhatsAppShare}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#25D366",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Share on WhatsApp
        </button>
      </div>
    </div>
  );
}