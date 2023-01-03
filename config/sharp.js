const Jimp = require("jimp");
const jimpFn = () => {
  Jimp.read(
    "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
  ).then((image1) => {
    Jimp.read(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"
    ).then(async (image2) => {
      // Use the composite method to combine the images
      image1
        .composite(image2, 100, 300, [
          {
            mode: Jimp.HORIZONTAL_ALIGN_CENTER,
            opacitySource: 1,
            opacityDest: 1,
          },
        ])
        .getBuffer(Jimp.MIME_JPEG, async (error, buffer) => {
          // Send the resulting image as a response to the client
          console.log(buffer);
          const image = await Jimp.read(buffer);
          console.log(image);
          await image.writeAsync("test.jpg");
        });
    });
  });
};

module.exports = jimpFn;
