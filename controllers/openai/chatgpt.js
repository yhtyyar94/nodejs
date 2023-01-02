require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.openai,
});
const openai = new OpenAIApi(configuration);
const res = async () => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Say this is a test",
    temperature: 0,
    max_tokens: 7,
  });
  return response;
};

module.exports = res;
