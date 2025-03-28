import path from "path";
import fs from "fs";
import { pipeline } from "stream";
import util from "util";
import Thumbnail from "../models/thumbnail.model";

const pipelineAsync = util.promisify(pipeline);

export const createThumbnail = async (req, res) => {
  try {
    const parts = req.part();
    let fields = {};
    let filename;

    for await (const part of parts) {
      if (part.file) {
        const fileName = `${Date.now()}-${part.filename}`;
        const saveTo = path.join(__dirname, "..", "uploads", fileName);
        await pipelineAsync(part.file, fs.createWriteStream(saveTo));
      } else {
        fields[part.name] = part.value;
      }
    }

    const thumbnail = new Thumbnail({
      user: req.user.id,
      videoName: fields.videoName,
      version: fields.version,
      image: `/uploads/thumbnails/${fileName}`,
      paid: fields.paid === "true",
    });
    await thumbnail.save();
    res.code(201).send(thumbnail);
  } catch (error) {
    res.send(error);
  }
};

export const getThumbnails = async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find({ user: req.user.id });
    res.send(thumbnails);
  } catch (error) {
    res.send(error);
  }
};

export const getThumbnail = async (req, res) => {
  try {
    // validate it first
    const thumbnail = await Thumbnail.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!thumbnail) {
      return res.notFound("Thumbnail not found");
    }
    res.send(thumbnail);
  } catch (error) {
    res.send(error);
  }
};

export const updateThumbnail = async (req, res) => {
  try {
    // validate it first
    const updatedData = req.body;
    const thumbnail = await findByIdAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      updatedData,
      {
        new: true,
      }
    );
    if (!thumbnail) {
      return res.notFound("Thumbnail not found");
    }
    res.send(thumbnail);
  } catch (error) {
    res.send(error);
  }
};
export const deleteThumbnail = async (req, res) => {
  try {
    // validate it first
    const thumbnail = await Thumbnail.findByIdAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!thumbnail) {
      return res.notFound("Thumbnail not found");
    }
    // delete the thumbnail image
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "thumbnails",
      path.basename(thumbnail.image)
    );
    fs.unlink(filePath, (err) => {
      if (err) fastify.log.error(err);
    });
    res.send({ message: "Thumbnail deleted successfully" });
  } catch (error) {
    res.send(error);
  }
};

export const deleteAllThumbnails = async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find({ user: req.user.id });
    await Thumbnail.deleteMany({ user: req.user.id });
    for (const thumbnail of thumbnails) {
      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "thumbnails",
        path.basename(thumbnail.image)
      )
      fs.unlink(filePath, (err) => {
        if (err) fastify.log.error(err);
      });
    }
    res.send({ message: "All thumbnails deleted successfully" });
  }catch (error) {
    res.send(error);
  }
};
