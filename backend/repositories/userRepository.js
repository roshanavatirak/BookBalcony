const User = require("../models/user");

class UserRepository {
  async findUserById(userId) {
    return await User.findById(userId).select("-password");
  }

  async removeFromCart(userId, bookId) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: bookId } },
      { new: true }
    );
  }

  async restoreCartItem(userId, bookId) {
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { cart: bookId } },
      { new: true }
    );
  }

  async clearCart(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { cart: [] } },
      { new: true }
    );
  }
}

module.exports = new UserRepository();
