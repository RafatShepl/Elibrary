// routes/cart.js
const express = require("express");
const Router = express.Router();

const {qookuiAuth} = require("../middelware/auth.js")

const Book = require("../models/book.js");
const Cart = require("../models/cart.js");

// Helper: recalculates totals from items array
function recalcTotals(cart) {
  cart.totalQuantity = cart.items.reduce((s, it) => s + (it.quantity || 0), 0);
  cart.totalPrice = cart.items.reduce((s, it) => s + ((it.quantity || 0) * (it.price || 0)), 0);
}

// GET current user's cart
Router.get("/", qookuiAuth, async (req, res) => {
  try {
    const currentUser = req.user;
    const userCart = await Cart.findOne({ user: currentUser.id })
      .populate("items.book", "title price coverImage category stock");

    if (!userCart) {
      return res.status(404).json({
        success: false,
        message: "لا يوجد سلة لهذا المستخدم."
      });
    }

    return res.status(200).json({
      success: true,
      message: "تم جلب السلة بنجاح.",
      data: userCart
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "فشل في جلب سلة المستخدم."
    });
  }
});

// POST add item to cart (increment if exists)
Router.post("/", qookuiAuth, async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const currentUser = req.user;

    if (!bookId) {
      return res.status(400).json({ success: false, message: "لم يتم تزويد bookId." });
    }
    const qty = Number(quantity) || 1;
    if (qty <= 0) {
      return res.status(400).json({ success: false, message: "الكمية يجب أن تكون أكبر من صفر." });
    }

    // find book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "الكتاب غير موجود في قاعدة البيانات." });
    }

    if (book.stock < qty) {
      return res.status(400).json({ success: false, message: `المخزون غير كافٍ. المتوفر: ${book.stock}` });
    }

    // get or create cart
    let cart = await Cart.findOne({ user: currentUser.id });

    if (!cart) {
      // create new cart
      cart = new Cart({
        user: currentUser.id,
        items: [{
          book: book._id,
          quantity: qty,
          price: book.price
        }]
      });
      recalcTotals(cart);

      // decrease book stock
      book.stock = book.stock - qty;

      await book.save();
      await cart.save();

      const populated = await cart.populate("items.book", "title price coverImage category stock");

      return res.status(201).json({
        success: true,
        message: "تم إنشاء السلة وإضافة الكتاب.",
        data: populated
      });
    }

    // cart exists -> check if item exists
    const idx = cart.items.findIndex(i => String(i.book) === String(book._id));
    if (idx !== -1) {
      // increment existing item
      cart.items[idx].quantity += qty;
    } else {
      // push new item
      cart.items.push({
        book: book._id,
        quantity: qty,
        price: book.price
      });
    }

    recalcTotals(cart);

    // decrease stock
    book.stock = book.stock - qty;
    if (book.stock < 0) {
      return res.status(400).json({ success: false, message: "لا يكفي المخزون بعد التحديث." });
    }

    await book.save();
    await cart.save();

    const populated = await Cart.findById(cart._id).populate("items.book", "title price coverImage category stock");

    return res.status(200).json({
      success: true,
      message: "تم إضافة الكتاب إلى السلة.",
      data: populated
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "فشل في إضافة الكتاب إلى السلة." });
  }
});

// PUT update an item's quantity (set to a new quantity) OR add if not exists
// Body: { bookId, quantity }  -> quantity must be >= 0
// If quantity === 0 -> item will be removed (and stock restored)
Router.put("/", qookuiAuth, async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const currentUser = req.user;

    if (!bookId) {
      return res.status(400).json({ success: false, message: "لم يتم تزويد bookId." });
    }
    if (quantity == null) {
      return res.status(400).json({ success: false, message: "يجب تزويد quantity." });
    }
    const newQty = Number(quantity);
    if (isNaN(newQty) || newQty < 0) {
      return res.status(400).json({ success: false, message: "الكمية غير صالحة." });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "الكتاب غير موجود." });
    }

    const cart = await Cart.findOne({ user: currentUser.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "المستخدم لا يمتلك سلة." });
    }

    const idx = cart.items.findIndex(i => String(i.book) === String(book._id));
    const existingQty = idx !== -1 ? cart.items[idx].quantity : 0;

    // If setting to same quantity -> nothing to do
    if (newQty === existingQty) {
      const populated = await Cart.findById(cart._id).populate("items.book", "title price coverImage category stock");
      return res.status(200).json({ success: true, message: "لا تغيير في الكمية.", data: populated });
    }

    // If increasing quantity -> check stock


    if (newQty > existingQty) {
      const diff = newQty - existingQty;
      if (book.stock < diff) {
        return res.status(400).json({ success: false, message: `المخزون غير كافٍ. المتوفر: ${book.stock}` });
      }
      // apply change: decrease stock by diff
      book.stock -= diff;
      if (idx !== -1) cart.items[idx].quantity = newQty;
      else {
        cart.items.push({ book: book._id, quantity: newQty, price: book.price });
      }
    } else {
      // newQty < existingQty : restore stock difference
      const diff = existingQty - newQty;
      book.stock += diff;
      if (newQty === 0) {
        // remove item
        if (idx !== -1) cart.items.splice(idx, 1);
      } else {
        if (idx !== -1) cart.items[idx].quantity = newQty;
        else {
          // shouldn't happen (existingQty was 0), but handle by adding item
          cart.items.push({ book: book._id, quantity: newQty, price: book.price });
        }
      }
    }

    recalcTotals(cart);

    await book.save();
    await cart.save();

    const populated = await Cart.findById(cart._id).populate("items.book", "title price coverImage category stock");

    return res.status(200).json({
      success: true,
      message: "تم تحديث كمية العنصر في السلة.",
      data: populated
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "فشل في تحديث السلة." });
  }
});

// DELETE remove an item from cart by book id (/:id)
Router.delete("/:id", qookuiAuth, async (req, res) => {
  try {
    const currentUser = req.user;
    const bookId = req.params.id;

    const cart = await Cart.findOne({ user: currentUser.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "لا يوجد سلة لهذا المستخدم." });
    }

    const idx = cart.items.findIndex(i => String(i.book) === String(bookId));
    if (idx === -1) {
      return res.status(400).json({ success: false, message: "هذا الكتاب غير موجود في السلة." });
    }

    // restore stock for removed quantity
    const removedItem = cart.items[idx];
    const book = await Book.findById(removedItem.book);
    if (book) {
      book.stock += removedItem.quantity;
      await book.save();
    }

    // remove item
    cart.items.splice(idx, 1);
    recalcTotals(cart);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate("items.book", "title price coverImage category stock");

    return res.status(200).json({
      success: true,
      message: "تم حذف الكتاب من السلة بنجاح.",
      data: populated
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "فشل في حذف العنصر من السلة." });
  }
});

module.exports = Router;
