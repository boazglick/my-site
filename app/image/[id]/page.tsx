"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ImagePage() {
  const { id } = useParams(); // Current image ID
  const router = useRouter();
  const iframeUrl = `https://drive.google.com/file/d/${id}/preview`; // Google Drive embed preview link

  const [imageName, setImageName] = useState("Loading...");
  const [images, setImages] = useState<string[]>([]); // Store the list of image IDs
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null); // Store the category ID

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const apiKey = "AIzaSyDtQcbLJO5wYNBcAjsvBTkyespCa57RHmU"; // Replace with your actual API key

        // Fetch the current image metadata to get its parent folder
        const imageResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files/${id}?fields=name,parents&key=${apiKey}`
        );
        const imageData = await imageResponse.json();

        if (!imageData.parents || imageData.parents.length === 0) {
          console.error("Error: No parent folder found for this image.");
          return;
        }

        const parentId = imageData.parents[0];
        setCategoryId(parentId);
        setImageName(imageData.name || "Image Viewer");

        // Fetch all images in the parent folder
        const folderResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${parentId}'+in+parents&fields=files(id)&key=${apiKey}`
        );
        const folderData = await folderResponse.json();
        const imageList = folderData.files.map((file: { id: string }) => file.id);

        setImages(imageList);

        // Find the current image index
        const currentIdx = imageList.indexOf(id);
        setCurrentIndex(currentIdx);
      } catch (error) {
        console.error("Error fetching image data:", error);
      }
    };

    fetchImageData();
  }, [id]);

  const handleNext = () => {
    if (currentIndex !== null && images.length > currentIndex + 1) {
      const nextImageId = images[currentIndex + 1];
      router.push(`/image/${nextImageId}`);
    }
  };

  const handlePrevious = () => {
    if (currentIndex !== null && currentIndex > 0) {
      const previousImageId = images[currentIndex - 1];
      router.push(`/image/${previousImageId}`);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      {/* Dynamic title */}
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>{imageName}</h1>

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
          onClick={handlePrevious}
          disabled={currentIndex === 0 || currentIndex === null}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor:
              currentIndex === 0 || currentIndex === null ? "#ccc" : "#5d5c5c",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor:
              currentIndex === 0 || currentIndex === null
                ? "not-allowed"
                : "pointer",
          }}
        >
          Previous Image
        </button>

        <button
          onClick={handleNext}
          disabled={
            currentIndex === null || currentIndex === images.length - 1
          }
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor:
              currentIndex === null || currentIndex === images.length - 1
                ? "#ccc"
                : "#5d5c5c",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor:
              currentIndex === null || currentIndex === images.length - 1
                ? "not-allowed"
                : "pointer",
          }}
        >
          Next Image
        </button>
      </div>

      {/* Navigation to Home and Category */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
        {categoryId && (
          <button
            onClick={() => router.push(`/category/${categoryId}`)}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              backgroundColor: "#007bff",
              color: "#fff",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Back to Category
          </button>
        )}
      </div>
    </div>
  );
}
