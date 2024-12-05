"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define a type for the image items
interface ImageItem {
  id: string;
  name: string;
}

export default function ImagePage() {
  const { id } = useParams(); // The file ID of the image from the URL
  const router = useRouter();
  const [images, setImages] = useState<ImageItem[]>([]); // Store all images in the category
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(-1); // Track the current image index
  const [imageName, setImageName] = useState("Loading...");

  // Fetch image list in the category dynamically using the "parent" ID of the image
  useEffect(() => {
    const fetchImages = async () => {
      const apiKey = "AIzaSyDtQcbLJO5wYNBcAjsvBTkyespCa57RHmU"; // Replace with your actual API key

      // Fetch image details to get the parent category ID
      const imageResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${id}?fields=parents,name&key=${apiKey}`
      );
      const imageData = await imageResponse.json();

      if (!imageData.parents || imageData.parents.length === 0) {
        console.error("Parent folder not found.");
        return;
      }

      const categoryId = imageData.parents[0]; // Get the parent category ID
      setImageName(imageData.name || "Image Viewer");

      // Fetch all files in the parent category
      const categoryResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${categoryId}'+in+parents&fields=files(id,name)&key=${apiKey}`
      );
      const categoryData = await categoryResponse.json();

      const imageList = categoryData.files || [];
      setImages(imageList);

      // Find the index of the current image in the category
      const currentIndex = imageList.findIndex((image: ImageItem) => image.id === id);
      setCurrentImageIndex(currentIndex);
    };

    fetchImages();
  }, [id]);

  // Navigate to the next or previous image
  const navigateToImage = (direction: "left" | "right") => {
    if (direction === "right" && currentImageIndex < images.length - 1) {
      const nextImage = images[currentImageIndex + 1];
      router.push(`/image/${nextImage.id}`);
    } else if (direction === "left" && currentImageIndex > 0) {
      const previousImage = images[currentImageIndex - 1];
      router.push(`/image/${previousImage.id}`);
    }
  };

  // Add keyboard event listeners for navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        navigateToImage("right"); // Go to the next image
      } else if (event.key === "ArrowLeft") {
        navigateToImage("left"); // Go to the previous image
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentImageIndex, images]);

  // Add swipe event listeners for mobile
  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      const startX = event.touches[0].clientX;

      const handleTouchEnd = (endEvent: TouchEvent) => {
        const endX = endEvent.changedTouches[0].clientX;
        const deltaX = endX - startX;

        if (deltaX > 50) {
          navigateToImage("left");
        } else if (deltaX < -50) {
          navigateToImage("right");
        }

        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchstart", handleTouchStart);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, [currentImageIndex, images]);

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
