const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
// FILE
const { v4: uuid } = require("uuid");
const AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.region,
  accessKeyId: process.env.accessKeyID,
  secretAccessKey: process.env.secretAccessKey,
});
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "Paper";
const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyID,
  secretAccessKey: process.env.secretAccessKey,
});
const CLOUD_FRONT_URL = "http://d3bcs23y1o2maa.cloudfront.net/";
// FILE - END
const sendMessage = asyncHandler(async (req, res, next) => {
  const { content, chatId, pic, file } = req.body;
  if (!content || !chatId) {
    console.log("Ko co content , chatId");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    pic: pic,
    file: file,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
// ko cần content
// stt ????
const sendFileMessage = asyncHandler(async (req, res, next) => {
  const { chatId } = req.body;
  if (!chatId) {
    console.log("Ko co chatId");
    return res.sendStatus(400);
  }
  /////////////////// TẠO TABLE MỚI ///////////////////////////////////////////////////
  // Connect AWS
  const image = req.file.originalname.split(".");
  const fileType = image[image.length - 1];
  const filePath = `${uuid() + Date.now().toString()}.${fileType}`;
  const params = {
    Bucket: "07-upload-image",
    Key: filePath,
    Body: req.file.buffer,
  };
  s3.upload(params, (error, data) => {
    if (error) res.send(error);
    else {
      const newItem = {
        TableName: tableName,
        Item: {
          image_url: `${CLOUD_FRONT_URL}${filePath}`,
          image_name: image[0],
        },
      };
      docClient.put(newItem, async (err, data) => {
        if (err) console.log(err);
        else {
          var newMessage = {
            sender: req.user._id,
            content: image[0],
            chat: chatId,
            file: `${CLOUD_FRONT_URL}${filePath}`,
          };
          try {
            var message = await Message.create(newMessage);
            message = await message.populate("sender", "name pic");
            message = await message.populate("chat");
            message = await User.populate(message, {
              path: "chat.users",
              select: "name pic email",
            });
            await Chat.findByIdAndUpdate(req.body.chatId, {
              latestMessage: message,
            });
            res.json(message);
          } catch (error) {
            res.status(400);
            throw new Error(error.message);
          }
        }
      });
    }
  });
});
const getFileMessageAWS = asyncHandler(async (req, res, next) => {
  const imageUrl = req.params.imageUrl;
  console.log("Image Url:", imageUrl);
  const params = {
    TableName: tableName,
    Key: {
      image_url: imageUrl,
    },
  };
  docClient.get(params, (err, data) => {
    if (err) res.send(err);
    else {
      res.json(data);
    }
  });
});
const getAllMessages = asyncHandler(async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const recallMessage = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.body;
    await Message.findByIdAndUpdate({ _id: id }, { recallMessage: 1 });
    var messRecall = await Message.findById({ _id: id })
      .populate("sender", "name pic")
      .populate("chat");
    messRecall = await User.populate(messRecall, {
      path: "chat.users",
      select: "name pic email",
    });
    console.log("CONTROLLER: ", messRecall);
    res.json(messRecall);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const getAllImageMessages = asyncHandler(async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .find({ content: "image" })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
module.exports = {
  sendMessage,
  sendFileMessage,
  getFileMessageAWS,
  getAllMessages,
  recallMessage,
  getAllImageMessages,
};
