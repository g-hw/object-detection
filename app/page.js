"use client";

import Image from "next/image";
import styles from "./page.module.css";
import ImageUploader from "./components/ImageUploader";
import { useState } from "react";

export default function Home() {
  const [imageResponse, setImageResponse] = useState(null);

  return (
    <main className={styles.main}>
      <h1>Ultralytics Gradio</h1>
      <h4>Upload images run object detection.</h4>
      <div style={{ marginTop: "50px", minHeight: "700px" }}>
        <ImageUploader setImageResponse={setImageResponse} />
      </div>
      <div id="container" style={{ paddingTop: "50px" }}>
        {imageResponse?.filePath && (
          <>
            <p>Object detection image:</p>
            <Image
              id="image"
              src={imageResponse?.filePath}
              alt="Image"
              width="1000"
              height="600"
            />
            {imageResponse?.body.map(({ box, label, score }, index) => {
              const container = document.getElementById("container");
              const containerRect = container?.getBoundingClientRect();
              const distanceToTop = containerRect?.top + window.scrollY;
              return (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    left: `${box?.xmin + 96}px`,
                    top: `${box?.ymin + distanceToTop}px`,
                    width: `${box?.xmax - box?.xmin}px`,
                    height: `${box?.ymax - box?.ymin}px`,
                    border: "2px solid red",
                  }}
                >
                  <div style={{ backgroundColor: "red", display: "inline" }}>
                    {label} {Number(score || 0).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </main>
  );
}
