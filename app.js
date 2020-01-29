const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("database.json");
const database = lowdb(adapter);
const app = require("./server");

//app.use(express.static("public"));

//Add new items-------------------------------------------
const addNewProduct = async (name, price, imgurl) => {
  const data = await database
    .get("products")
    .push({ name, price, imgurl })
    .write();
  return data;
};

app.post("/api/products", async (request, response) => {
  let message = {
    success: true,
    message: "New item added"
  };
  const { name, price, imgurl } = request.query;
  const data = await addNewProduct(name, price, imgurl);
  message.data = data[res.length - 1];
  return response.send(message);
});

//Get itemlist--------------------------------------------------
app.get("/api/products", (request, response) => {
  response.json(database.get("products").value());
  return response;
});

//Add to cart-----------------------------------------------------
const addToCart = async name => {
  const checkCart = await database
    .get("cart")
    .find({ name })
    .value();
  if (checkCart) {
    let message = "";

    return message;
  } else {
    let data = await database
      .get("products")
      .find({ name })
      .value();

    if (data) {
      data = await database
        .get("cart")
        .push(data)
        .write();
      return data;
    } else {
      message = false;

      return message;
    }
  }
};

app.post("/api/cart", async (request, response) => {
  const { name } = request.query;
  const data = await addToCart(name);
  let message = {
    success: true,
    message: "Item added to cart"
  };
  if (typeof data == "string" || data instanceof String) {
    message = {
      succses: false,
      message: "Item already in your cart"
    };
  } else if (data === false) {
    message = {
      succses: false,
      message: "Item not found"
    };
  }
  message.data = data[data.length - 1];

  return response.send(message);
});

//Get shoppingcart--------------------------------------------------
app.get("/api/cart", (request, response) => {
  response.json(database.get("cart").value());
  return response;
});

//Delete item from cart--------------------------------------------
const removeItem = async name => {
  const checkCart = await database
    .get("cart")
    .find({ name })
    .value();

  if (checkCart) {
    let response = await database
      .get("cart")
      .remove({ name })
      .write();
    return response;
  } else {
    response = "";

    return response;
  }
};

app.delete("/api/cart", async (request, response) => {
  const { name } = request.query;
  const data = await removeItem(name);

  if (typeof data == "string" || data instanceof String) {
    message = {
      success: false,
      message: "Item not found"
    };
  } else {
    message = {
      success: true,
      message: "Item removed"
    };
  }
  message.data = data[response.lenght - 1];
  return response.send(message);
});
