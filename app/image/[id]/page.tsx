"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ImageItem {
  id: string;
  name: string;
}

export default function ImagePage() {
  const { id } = useParams(); // Get the image ID from the URL
  const router = useRouter();
  const [images, setImages] = useState<ImageItem[]>([]); // All images in the category
  const [currentImageIndex, setCurrentImageIndex] = useState(-1); // Index of the current image
  const [imageName, setImageName] = useState("Loading...");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const apiKey = "YOUR_GOOGLE_API_KEY";
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${id}?fields=parents,name&key=${apiKey}`
        );
        const imageData = await response.json();

        if (!imageData.parents || imageData.parents.length === 0) {
          console.error("No parent folder found for this image");
          return;
        }

        const categoryId = imageData.parents[0]; // Safely access the first parent
        setImageName(imageData.name || "Image Viewer");

        const categoryResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${categoryId}'+in+parents&fields=files(id,name)&key=${apiKey}`
        );
        const categoryData = await categoryResponse.json();
        const imageList = categoryData.files || [];

        setImages(imageList);

        const currentIndex = imageList.findIndex((img) => img.id === id);
        setCurrentImageIndex(currentIndex);
      } catch (error) {
        console.error("Error fetching image data:", error);
      }
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") navigateToImage("right");
      else if (event.key === "ArrowLeft") navigateToImage("left");
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentImageIndex, images]);

  // Swipe navigation for mobile
  useEffect(() => {
    let startX: number | null = null;

    const handleTouchStart = (event: TouchEvent) => {
      startX = event.touches[0].clientX;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (startX === null) return;

      const endX = event.changedTouches[0].clientX;
      const deltaX = endX - startX;

      if (deltaX > 50) navigateToImage("left"); // Swipe left
      else if (deltaX < -50) navigateToImage("right"); // Swipe right

      startX = null;
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentImageIndex, images]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ textAlign: "center" }}>{imageName}</h1>
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
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <button onClick={() => router.push("/")}>Back to Home</button>
        <button onClick={() => router.back()}>Back to Previous Category</button>
      </div>
    </div>
  );
}
