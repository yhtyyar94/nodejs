require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const telegramBot = () => {
  const bot = new TelegramBot(process.env.Telegram, { polling: true });
  const commands = [
    {
      command: "/sor",
      description: "Open Bot",
    },
  ];

  bot.setMyCommands(commands);
  let started;
  let chatId;
  let userId;
  let productName;
  let frontImage;
  let ingredients;
  let barcode;
  let description;
  let marketName;

  bot.on("message", async (msg) => {
    chatId = msg.chat.id;

    console.log(msg);

    if (msg.reply_to_message) {
      const replyUserId = msg.reply_to_message.text.slice(
        msg.reply_to_message.text.indexOf("Kullanici ID: ") + 14,
        msg.reply_to_message.text.indexOf("Kullanici ID: ") + 25
      );

      const replyChatId = msg.reply_to_message.text.slice(
        msg.reply_to_message.text.indexOf("Chat ID: ") + 9,
        msg.reply_to_message.text.indexOf("Chat ID: ") + 25
      );
      const replyProductName = msg.reply_to_message.text.slice(
        msg.reply_to_message.text.indexOf("Urun adi: ") + 10,
        msg.reply_to_message.text.indexOf("Market adi:")
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
        bot.sendMessage(chatId, "Eklemek istediginiz urunun ismini girin");
        started = true;
        productName = false;
        frontImage = false;
        ingredients = false;
        barcode = false;
        description = false;
        marketName = false;
      }
    } else if (!started) {
      bot.sendMessage(chatId, "Menu'den bot'u baslatin");
      return;
    } else if (msg.chat.type !== "group") {
      if (!productName) {
        productName = msg.text;
        bot.sendMessage(chatId, "Urunun on tarafinin resmini yukleyin");
      } else if (!frontImage) {
        bot.sendMessage(
          chatId,
          "Okunur bi sekilde urunun icerik kisminin resmini yukleyin"
        );
      } else if (!ingredients) {
        bot.sendMessage(
          chatId,
          "Okunur bi sekilde urunun barcode kisminin resmini yukleyin"
        );
      } else if (!barcode) {
        bot.sendMessage(chatId, "Market ismini girin");
      } else if (!marketName) {
        marketName = msg.text;
        bot.sendMessage(chatId, "Aciklama ekleyin");
      } else if (!description) {
        description = msg.text;
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
              <span class="tg-spoiler">Urun adi: <b>${productName}</b></span>
              <span class="tg-spoiler">Market adi: <b>${marketName}</b></span>
              <span class="tg-spoiler">Aciklama: <b>${description}</b></span>
              <span class="tg-spoiler">Kullanici ID: <b>${userId}</b></span>
              <span class="tg-spoiler">Chat ID: <b>${chatId}</b></span>
              <a href="tg://user?id=${userId}">Kullaniciya mesaj gonder</a>
              `;
          await bot.sendPhoto(1194064413, frontImage);
          await bot.sendPhoto(1194064413, ingredients);
          await bot.sendPhoto(1194064413, barcode);
          bot.sendMessage(1194064413, html, { parse_mode: "HTML" });
          started = false;
          chatId = false;
          userId = false;
          productName = false;
          frontImage = false;
          ingredients = false;
          barcode = false;
          description = false;
          marketName = false;
        }
      }

      if (msg.chat.type !== "group" && msg.photo) {
        // Get the file_id of the photo
        const fileId = msg.photo[msg.photo.length - 1].file_id;

        if (!frontImage) {
          frontImage = fileId;
        } else if (!ingredients) {
          ingredients = fileId;
        } else if (!barcode) {
          barcode = fileId;
        }
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
