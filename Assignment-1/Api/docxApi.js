const apiRouter = require("express").Router();
const multer = require("multer");
const fs = require("fs");
var path = require("path");
const upload = multer({ dest: "uploads/" });
const docx = require("docx");
const { Document, ImageRun, Packer, Paragraph } = docx;

apiRouter.post("/img/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                data: fs.readFileSync(req.file.path),
                transformation: {
                  width: 500,
                  height: 500,
                },
              }),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(req.file.filename + ".docx", buffer);
    res.sendFile(req.file.filename + ".docx", {
      root: path.join(__dirname, "../"),
    });
    // fs.unlink(req.file.originalname + ".docx", function (err) {
        // if (err) throw err;
        // console.log('File deleted!');
    // });
    console.log("Document created successfully");
  });
});

apiRouter.post("/img/uploads", upload.array("image"), (req, res) => {
  const images = req.files;
  console.log(req.files);
  images.forEach((img) => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: fs.readFileSync(img.path),
                  transformation: {
                    width: 500,
                    height: 500,
                  },
                }),
              ],
            }),
          ],
        },
      ],
    });
    Packer.toBuffer(doc).then((buffer) => {
      fs.writeFileSync(img.filename + ".docx", buffer);
      console.log("Document created successfully");
    });
  });
});

module.exports = apiRouter;
