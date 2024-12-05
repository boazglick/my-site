"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ImageItem {
  id: string;
  name: string;
}

export default function ImagePage() {
  const { id } = useParams(); // Get the current image ID from the URL
  const router = useRouter();
  const [images, setImages] = useState<ImageItem[]>([]); // Store all images in the category
  const [currentIndex, setCurrentIndex] = useState(-1); // Index of the current image
  const [imageName, setImageName] = useState("Loading...");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const apiKey = "AIzaSyDtQcbLJO5wYNBcAjsvBTkyespCa57RHmU";
        const imageResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files/${id}?fields=name,parents&key=${apiKey}`
        );
        const imageData = await imageResponse.json();

        if (!imageData.parents || imageData.parents.length === 0) {
          console.error("No parent folder found for this image.");
          return;
        }

        const categoryId = imageData.parents[0]; // Parent folder ID
        setImageName(imageData.name);

        const categoryResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${categoryId}'+in+parents&fields=files(id,name)&key=${apiKey}`
        );
        const categoryData = await categoryResponse.json();

        const imageList = categoryData.files || [];
        setImages(imageList);

        // Use findIndex with proper typing
        const currentIdx = imageList.findIndex((img: ImageItem) => img.id === id);
        setCurrentIndex(currentIdx);
              } catch (error) {
        console.error("Error fetching image data:", error);
      }
    };

    fetchImages();
  }, [id]);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      const nextImage = images[currentIndex + 1];
      router.push(`/image/${nextImage.id}`);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevImage = images[currentIndex - 1];
      router.push(`/image/${prevImage.id}`);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      {/* Display the image name */}
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>{imageName}</h1>

      {/* Embed the image using iframe */}
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
          src={`https://drive.google.com/file/d/${id}/preview`}
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
            backgroundColor: currentIndex > 0 ? "#5d5c5c" : "#ddd",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor: currentIndex > 0 ? "pointer" : "not-allowed",
          }}
          disabled={currentIndex <= 0}
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor:
              currentIndex < images.length - 1 ? "#5d5c5c" : "#ddd",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor:
              currentIndex < images.length - 1 ? "pointer" : "not-allowed",
          }}
          disabled={currentIndex >= images.length - 1}
          onClick={handleNext}
        >
          Next
        </button>
      </div>

      {/* Back navigation buttons */}
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
    </div>
  );
}
