require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const mergeImages = require("./jimp");
const fs = require("fs");
const bot = new TelegramBot(process.env.Telegram, {
  polling: true,
});
const telegramBot = () => {
  const commands = [
    {
      command: "/sor",
      description: "Open Bot",
    },
  ];

  bot.setMyCommands(commands);
  let step = 0;
  let started;
  let chatId;
  let userId;
  let productName;
  let frontImage;
  let ingredients;
  let barcode;
  let description;
  let marketName;
  let imageUrls = [];

  bot.on("callback_query", (query) => {
    console.log("query", query);
    const replyUserId = query.message.caption.slice(
      query.message.caption.indexOf("Kullanici ID: ") + 14,
      query.message.caption.indexOf("Kullanici ID: ") + 25
    );

    const replyChatId = query.message.caption.slice(
      query.message.caption.indexOf("Chat ID: ") + 9,
      query.message.caption.indexOf("Chat ID: ") + 25
    );
    const replyProductName = query.message.caption.slice(
      query.message.caption.indexOf("Urun adi: ") + 10,
      query.message.caption.indexOf("Market adi:")
    );
    let actionMsg;

    let html = `
    <i>${replyProductName}</i>
    <b>${actionMsg}</b>
    `;

    switch (query.data) {
      case "button1":
        actionMsg = "Uygun";
        html = `
        <i>${replyProductName}</i>
        <b>${actionMsg}</b>
        `;
        bot.sendMessage(replyChatId, html, { parse_mode: "HTML" });
        bot.editMessageReplyMarkup(
          {
            inline_keyboard: [
              [
                { text: "Urunu Sil", callback_data: "sil" },
                { text: "Database'a gonder", callback_data: "database" },
              ],
            ],
          },
          { chat_id: 1194064413, message_id: query.message.message_id }
        );
        break;
      case "button2":
        actionMsg = "Supheli";
        html = `
        <i>${replyProductName}</i>
        <b>${actionMsg}</b>
        `;
        bot.sendMessage(replyChatId, html, { parse_mode: "HTML" });
        bot.editMessageReplyMarkup(
          {
            inline_keyboard: [
              [
                { text: "Urunu Sil", callback_data: "sil" },
                { text: "Database'a gonder", callback_data: "database" },
              ],
            ],
          },
          { chat_id: 1194064413, message_id: query.message.message_id }
        );
        break;
      case "button3":
        actionMsg = "Uygun degil";
        html = `
        <i>${replyProductName}</i>
        <b>${actionMsg}</b>
        `;
        bot.sendMessage(replyChatId, html, { parse_mode: "HTML" });
        bot.editMessageReplyMarkup(
          {
            inline_keyboard: [
              [
                { text: "Urunu Sil", callback_data: "sil" },
                { text: "Database'a gonder", callback_data: "database" },
              ],
            ],
          },
          { chat_id: 1194064413, message_id: query.message.message_id }
        );
        break;
      case "sil":
        bot.deleteMessage(1194064413, query.message.message_id);
        bot.editMessageReplyMarkup(
          {
            inline_keyboard: [
              [
                { text: "Urunu Sil", callback_data: "sil" },
                { text: "Database'a gonder", callback_data: "database" },
              ],
            ],
          },
          { chat_id: 1194064413, message_id: query.message.message_id }
        );
        break;
      case "database":
        bot
          .sendMessage(1194064413, "Database oldugunda ins gonderiririz 😀")
          .then((data) => {
            setTimeout(() => {
              bot.deleteMessage(1194064413, data.message_id);
            }, 3000);
          });
        break;
    }

    return;
  });

  bot.on("message", async (msg) => {
    chatId = msg.chat.id;
    let fileId;
    if (msg.photo) {
      fileId = msg.photo[msg.photo.length - 1].file_id;
    }

    console.log(msg);

    if (msg.reply_to_message) {
      const replyUserId = msg.reply_to_message.caption.slice(
        msg.reply_to_message.caption.indexOf("Kullanici ID: ") + 14,
        msg.reply_to_message.caption.indexOf("Kullanici ID: ") + 25
      );

      const replyChatId = msg.reply_to_message.caption.slice(
        msg.reply_to_message.caption.indexOf("Chat ID: ") + 9,
        msg.reply_to_message.caption.indexOf("Chat ID: ") + 25
      );
      const replyProductName = msg.reply_to_message.caption.slice(
        msg.reply_to_message.caption.indexOf("Urun adi: ") + 10,
        msg.reply_to_message.caption.indexOf("Market adi:")
      );
      const html = `
          <i>${replyProductName}</i>
          <b>${msg.text}</b>
          `;

      bot.sendMessage(replyChatId, html, { parse_mode: "HTML" });
      return;
    }

    if (msg.text && msg.text === "/start") {
      userId = msg.from.id;

      bot.sendMessage(
        chatId,
        "Bot calisiyor! Menu'den yapmak istediginiz islemi secin."
      );
    } else if (msg.text && msg.text === "/sor") {
      userId = msg.from.id;
      if (msg.chat.type === "group") {
        bot
          .sendMessage(chatId, "Bota yazmak icin tiklayin @EagleNlbot")
          .then((sentMessage) => {
            setTimeout(() => {
              bot.deleteMessage(chatId, msg.message_id);
              bot.deleteMessage(chatId, sentMessage.message_id);
            }, 4000);
          });
      } else {
        step = 1;
        started = true;
        productName = false;
        frontImage = false;
        ingredients = false;
        barcode = false;
        description = false;
        marketName = false;
        bot.sendMessage(chatId, "Eklemek istediginiz urunun ismini girin");
      }
    } else if (!started && msg.chat.type !== "group") {
      bot.sendMessage(chatId, "Menu'den bot'u baslatin");
      return;
    } else if (msg.chat.type !== "group") {
      if (!started) {
        bot.sendMessage(chatId, "Menu'den bot'u baslatin");
        return;
      }

      switch (step) {
        case 1:
          if (!msg.text) {
            bot.sendMessage(chatId, "Eklemek istediginiz urunun ismini girin");
            return;
          } else {
            productName = msg.text;
            step = 2;
            bot.sendMessage(chatId, "Urunun on tarafinin resmini yukleyin");
          }
          break;
        case 2:
          if (!frontImage && !msg.photo) {
            bot.sendMessage(chatId, "Urunun on tarafinin resmini yukleyin");
            return;
          } else {
            frontImage = fileId;
            step = 3;
            bot.sendMessage(
              chatId,
              "Okunur bi sekilde urunun icerik kisminin resmini yukleyin"
            );
          }
          break;
        case 3:
          if (!ingredients && !msg.photo) {
            bot.sendMessage(
              chatId,
              "Okunur bi sekilde urunun icerik kisminin resmini yukleyin"
            );
            return;
          } else {
            ingredients = fileId;
            step = 4;
            bot.sendMessage(
              chatId,
              "Okunur bi sekilde urunun barcode kisminin resmini yukleyin"
            );
          }
          break;
        case 4:
          if (!barcode && !msg.photo) {
            bot.sendMessage(
              chatId,
              "Okunur bi sekilde urunun barcode kisminin resmini yukleyin"
            );
            return;
          } else {
            barcode = fileId;
            step = 5;
            bot.sendMessage(chatId, "Market ismini girin");
          }
          break;
        case 5:
          if (!msg.text) {
            bot.sendMessage(chatId, "Market ismini girin");
            return;
          } else {
            marketName = msg.text;
            step = 6;
            bot.sendMessage(chatId, "Aciklama ekleyin");
          }
          break;
        case 6:
          if (!msg.text) {
            bot.sendMessage(chatId, "Aciklama ekleyin");
            return;
          } else {
            description = msg.text;
            step = 7;
            if (
              chatId &&
              userId &&
              productName &&
              frontImage &&
              ingredients &&
              barcode &&
              description
            ) {
              bot.sendMessage(
                chatId,
                "Urununiz adminlere iletilti en kisa zamanda size geri donus yapacagiz"
              );
              const html = `
              <pre>Urun adi: <b>${productName}</b></pre>
              <pre>Market adi: <b>${marketName}</b></pre>
              <pre>Aciklama: <b>${description}</b></pre>
              <pre>Kullanici ID: <b>${userId}</b></pre>
              <pre>Chat ID: <b>${chatId}</b></pre>
              <a href="tg://user?id=${userId}">Kullaniciya mesaj gonder</a>`;
              const buttons = [
                [
                  {
                    text: "Uygun",
                    callback_data: "button1",
                  },
                  {
                    text: "Supheli",
                    callback_data: "button2",
                  },
                ],
                [
                  {
                    text: "Uygun Degil",
                    callback_data: "button3",
                  },
                ],
              ];

              await bot.getFile(frontImage).then((file) => {
                // Get the image URL
                const imageUrl = `https://api.telegram.org/file/bot${process.env.Telegram}/${file.file_path}`;
                imageUrls.push(imageUrl);
              });
              await bot.getFile(ingredients).then((file) => {
                // Get the image URL
                const imageUrl = `https://api.telegram.org/file/bot${process.env.Telegram}/${file.file_path}`;
                imageUrls.push(imageUrl);
              });

              await bot.getFile(barcode).then((file) => {
                // Get the image URL
                const imageUrl = `https://api.telegram.org/file/bot${process.env.Telegram}/${file.file_path}`;
                imageUrls.push(imageUrl);
              });
              console.log(imageUrls);
              const mergedImage = await mergeImages(imageUrls);
              await mergedImage.writeAsync("merged.jpg");
              const imageData = fs.readFileSync("merged.jpg");
              console.log(imageData);
              bot
                .sendPhoto(1194064413, imageData, {
                  caption: html,
                  parse_mode: "HTML",
                  reply_markup: { inline_keyboard: buttons },
                })
                .then((data) => {
                  // bot.sendMessage(
                  //   1194064413,
                  //   productName + " is:",
                  //   replyMarkup
                  // );
                  // console.log(data);
                })
                .catch((err) => {
                  console.log(err);
                });

              started = false;
              chatId = false;
              userId = false;
              productName = false;
              frontImage = false;
              ingredients = false;
              barcode = false;
              description = false;
              marketName = false;
              imageUrls = [];
              step = 0;
            } else {
              bot.sendMessage(
                chatId,
                "Urun yulerken bir hata olustu. Bot yeniden baslatiliyor"
              );
              bot.sendMessage(chatId, "/sor");
            }
          }
          break;
      }
    }
    console.log(
      frontImage,
      ingredients,
      barcode,
      marketName,
      description,
      productName
    );
  });
};

module.exports = telegramBot;
