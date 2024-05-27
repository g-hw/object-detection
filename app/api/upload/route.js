import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import sharp from "sharp";

export const POST = async (req, res) => {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(" ", "_");

  try {
    await writeFile(
      path.join(process.cwd(), "public/uploads/" + filename),
      buffer
    );

    const resizedBuffer = await sharp(buffer)
      .resize({ width: 1000, height: 600 }) // Set the desired dimensions (e.g., 500x300)
      .toBuffer(); // Convert the resized image to a buffer

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
        method: "POST",
        body: resizedBuffer,
      }
    );
    const result = await response.json();
    const filePath = `/uploads/${filename}`;

    return NextResponse.json({
      Message: "Success",
      status: 201,
      filePath,
      body: result,
    });
  } catch (error) {
    console.error("Error occurred ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
