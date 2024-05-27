import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Image from "next/image";

const ImageUploader = ({ setImageResponse }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    setIsLoading(true);
    axios
      .post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setUploadedImage(response.data.filePath);
        setImageResponse(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error uploading the image", error);
        setIsLoading(false);
      });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div
        {...getRootProps({ className: "dropzone" })}
        style={{
          border: "2px dashed #0070f3",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          width: "1000px",
        }}
      >
        <input {...getInputProps()} />
        <p>
          {isLoading
            ? "Loading..."
            : "Drag drop some files here, or click to select files"}
        </p>
      </div>
      {uploadedImage && (
        <div style={{ marginTop: "20px" }}>
          <p>Uploaded Image:</p>
          <Image
            src={uploadedImage}
            alt="Uploaded"
            style={{ maxWidth: "100%" }}
            width={1000}
            height={600}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
