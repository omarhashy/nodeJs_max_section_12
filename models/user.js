const mongoose = require("mongoose");
const product = require("./product");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() == product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const { getDb } = require("../util/database");
// const ObjectId = require("mongodb").ObjectId;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }
//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   getCart() {
//     const db = getDb();
//     const productId = this.cart.items.map((i) => {
//       return i.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productId } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       });
//   }

//   addToCart(product) {

//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter((item) => {
//       return item.productId.toString() !== productId.toString();
//     });
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();

//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//             email: this.email,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then(() => {
//         db.collection("users")
//           .findOne({ _id: new ObjectId(this._id) })
//           .then((result) => {
//             this.cart = { items: [] };
//             return db
//               .collection("users")
//               .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: { items: [] } } }
//               );
//           });
//       })

//       .catch((err) => console.error(err));
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//   }
//   static findById(userId) {
//     const db = getDb();
//     return db.collection("users").findOne({ _id: new ObjectId(userId) });
//   }
// }
// module.exports = User;
