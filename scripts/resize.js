const { glob } = require("glob");
const sharp = require("sharp");
const path = require("path");
const { mkdir } = require("node:fs/promises");

async function resizeImages() {
  const images = await glob("./public/images/**/*.jpg", {
    ignore: "./public/images/resized/**/*.jpg",
  });
  console.log(`Found ${images.length} images to resize.`);
  for (const image of images) {
    // check current size of image
    const metadata = await sharp(image).metadata();
    if (metadata.width <= 1960) {
      console.log(
        `Skipping ${image} because it is already smaller than 1960px.`,
      );
      continue;
    }
    const output = image.replace("public/images/", "public/images/resized/");
    const dir = path.dirname(output);
    await mkdir(dir, { recursive: true });
    console.log(
      `Resizing ${image} with current width ${metadata.width} to ${output}`,
    );
    await sharp(image).resize(1960).toFile(output);
  }
}

resizeImages()
  .then(() => console.log("All images resized successfully."))
  .catch((err) => console.error("Error resizing images:", err));
