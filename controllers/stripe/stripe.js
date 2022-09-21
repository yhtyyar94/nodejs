require("dotenv").config();
const stripe = require("stripe")(process.env.StripePrivateKey);

const store = new Map([
  [
    1,
    {
      price: 100,
      name: "Iphone X",
      imageUrl:
        "https://mobiel-product.imgix.net/b644swr1ooft8u2xw1vrbcqmvluf?w=540&h=540&trim=none&auto=compress%2Cformat",
    },
  ],
  [
    2,
    {
      price: 150,
      name: "Iphone 12",
      imageUrl:
        "https://cdn-files.kimovil.com/phone_front/0001/88/thumb_87957_phone_front_big.jpeg",
    },
  ],
]);

const checkout = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        const storeItem = store.get(item.id);
        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      success_url: "https://www.google.com",
      cancel_url: "https://www.google.com",
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = checkout;
