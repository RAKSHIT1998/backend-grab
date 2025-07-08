
const { Router } = require("express");
const auth = require("../middleware/auth");
const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const menuModel = require("../models/menuModel");
const nodemailer = require("nodemailer");

const orderRouter = Router();
orderRouter.use(auth);

// Email configuration - Update with your SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: "sneelesh182@gmail.com", // Your email
    pass: "jtim dtvp edkz kwnx"  // Your email password or app password
  }
});

// Admin and Chef email addresses - Update these
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sneelesh182@gmail.com';
const CHEF_EMAIL = process.env.CHEF_EMAIL || 'neelesh.86agency@gmail.com';

// Helper function to send customer email
const sendCustomerEmail = async (order, user) => {
  const orderItemsHtml = order.orderItems.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.itemName}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.categoryName}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">₹${item.price}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: ADMIN_EMAIL,
    to: order.customerEmail,
    subject: `Order Confirmation #${order._id} - Thank You!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #392223;">Order Placed Successfully</h2>
        
        <p>Dear ${order.customerName},</p>
        <p>Thank you for your order! We're preparing your delicious meal.</p>
        
        <div style="background: #f8e9e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #c52d30; margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Table Number:</strong> ${order.tableNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        </div>

        <div style="background: #f8e9e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #c52d30; margin-top: 0;">Your Order</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background: #392223; color: white;">
                <th style="padding: 10px; border: 1px solid #ddd;">Item Name</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Category</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>
        </div>

        <p>Your order is being prepared and will be served shortly!</p>
        <p>Thank you for dining with us!</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Helper function to send admin email
const sendAdminEmail = async (order, user) => {
  const orderItemsHtml = order.orderItems.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.itemName}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.categoryName}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">₹${item.price}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: ADMIN_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Order #${order._id} - Table ${order.tableNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #392223;">New Order Received</h2>
        
        <div style="background: #f8e9e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #c52d30; margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Table Number:</strong> ${order.tableNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        </div>

        <div style="background: #f8e9e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #c52d30; margin-top: 0;">Customer Details</h3>
          <p><strong>Name:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Phone:</strong> ${order.customerPhone}</p>
        </div>

        <div style="background: #f8e9e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #c52d30; margin-top: 0;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background: #392223; color: white;">
                <th style="padding: 10px; border: 1px solid #ddd;">Item Name</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Category</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Helper function to send chef email
const sendChefEmail = async (order) => {
  const orderItemsHtml = order.orderItems.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.itemName}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.categoryName}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.description || 'No special instructions'}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: ADMIN_EMAIL,
    to: CHEF_EMAIL,
    subject: `Kitchen Order #${order._id} - Table ${order.tableNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #392223;">Kitchen Order</h2>
        
        <div style="background: #f8e9e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #c52d30; margin-top: 0;">Order Information</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Customer Name:</strong> ${order.customerName}</p>
          <p><strong>Table Number:</strong> ${order.tableNumber}</p>
          <p><strong>Order Time:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
        </div>

        <div style="background: #f8e9e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #c52d30; margin-top: 0;">Items to Prepare</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background: #392223; color: white;">
                <th style="padding: 10px; border: 1px solid #ddd;">Item Name</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Category</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Notes</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// POST - Create new order (place order)
orderRouter.post("/", async (req, res) => {
  const { tableNumber } = req.body;
  const userId = req.user._id;

  try {
    // Get user details
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get cart items
    const cartItems = await cartModel.find({ userId }).populate("itemId");
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Filter only available items
    // const availableItems = cartItems.filter(item => item.itemId?.availability !== false);
    // if (availableItems.length === 0) {
    //   return res.status(400).json({ message: "No available items in cart" });
    // }

        const inventoryErrors = [];
    const validatedItems = [];

    for (const cartItem of cartItems) {
      const menuItem = await menuModel.findById(cartItem.itemId._id);
      if (!menuItem || !menuItem.availability) {
        inventoryErrors.push(`${cartItem.itemName} is no longer available`);
        continue;
      }
      if (menuItem.quantity < cartItem.quantity) {
        inventoryErrors.push(`Only ${menuItem.quantity} ${cartItem.itemName}(s) available, but you requested ${cartItem.quantity}`);
        continue;
      }
      validatedItems.push(cartItem);
    }

    if (inventoryErrors.length > 0) {
      return res.status(400).json({ message: "Inventory validation failed", errors: inventoryErrors });
    }

    if (validatedItems.length === 0) {
      return res.status(400).json({ message: "No valid items in cart" });
    }


    // Calculate total amount
    const totalAmount = validatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Prepare order items
    const orderItems = validatedItems.map(item => ({
      itemId: item.itemId._id,
      itemName: item.itemName,
      categoryName: item.categoryName,
      price: item.price,
      quantity: item.quantity,
      description: item.description
    }));

    // Create order
    const order = await orderModel.create({
      userId,
      orderItems,
      tableNumber,
      totalAmount,
      customerName: user.userName,
      customerEmail: user.email,
      customerPhone: user.phone
    });

    // Clear cart after successful order
    await cartModel.deleteMany({ userId });

    const inventoryUpdates = [];
    for (const item of validatedItems) {
      const updatedItem = await menuModel.findByIdAndUpdate(
        item.itemId._id,
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );

      if (updatedItem.quantity === 0) {
        await menuModel.findByIdAndUpdate(updatedItem._id, { availability: false }, { new: true });
        updatedItem.availability = false;
      }

      inventoryUpdates.push(updatedItem);
    }

    for (const updatedItem of inventoryUpdates) {
      req.io.emit("menuItemUpdated", updatedItem);

      if (!updatedItem.availability) {
        const removedItems = await cartModel.find({ itemId: updatedItem._id });
        await cartModel.deleteMany({ itemId: updatedItem._id });

        removedItems.forEach(cartItem => {
          req.io.emit("cartItemRemovedByAdmin", {
            userId: cartItem.userId,
            itemId: updatedItem._id,
            cartItemId: cartItem._id,
            action: "removed_by_stock_depletion",
            message: `${updatedItem.itemName} is now out of stock`
          });
        });
      } else {
        req.io.emit("inventoryUpdated", {
          itemId: updatedItem._id,
          newQuantity: updatedItem.quantity,
          availability: updatedItem.availability
        });
      }
    }
    // Send emails
    try {
      await Promise.all([
        sendCustomerEmail(order, user),
        sendAdminEmail(order, user),
        sendChefEmail(order)
      ]);
      req.io.emit("cartCleared", { userId, action: "order_placed" });
  
      return res.status(201).json({
        message: "Order placed successfully",
        orderId: order._id,
        order
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the order if email fails
    }

    // Emit socket event for cart cleared

  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET - Get all orders for logged-in user
orderRouter.get("/", async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET - Get specific order by ID
orderRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const order = await orderModel.findOne({ _id: id, userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    return res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Admin routes - Get all orders (requires admin role check)
orderRouter.get("/admin/all", async (req, res) => {
  try {
    // Add admin role check here if needed
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ message: "Admin access required" });
    // }
    
    const orders = await orderModel.find({})
      .populate('userId', 'userName email phone')
      .sort({ createdAt: -1 });
    
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Admin routes - Update order status
orderRouter.patch("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;
    
    // Add admin role check here if needed
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ message: "Admin access required" });
    // }
    
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    
    const order = await orderModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    return res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = orderRouter;
