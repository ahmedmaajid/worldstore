import orders from "../models/orders.js";
import User from "../models/users.js";
import Commerce from "../models/commerce.js";
import Cart from "../models/cart.js";
import { orderConfirmation } from "../mail/MailToCustomer.js";
import { mail_a_new_cartOrder, newOrderAlert, orderCancellation } from "../mail/MailToAdmin.js";
import { mail_c_new_cartOrder } from "../mail/MailToCustomer.js";
// export const createOrder = async (req, res) => {
//     try {
//         const { formData, appliedPromo, total, cartItems, shippingFee } = req.body;
//         const userId = req.user.id; // assume you have user auth middleware
//         console.log(userId, shippingFee)
//         // check coupon usage
//         if (appliedPromo?.code) {
//             const user = await User.findById(userId);
//             if (user.usedCoupons.includes(appliedPromo.code)) {
//                 console.log("Coupon already used!")
//                 return res.status(400).json({ message: "Coupon already used" });
//             }
//         }

//         // create new order
//         const order = new orders({
//             user: userId,
//             items: cartItems,
//             shippingFee: shippingFee,
//             freeShippingOver: null,
//             coupon: appliedPromo || null,
//             subtotal: total + (appliedPromo?.discountValue || 0),
//             discount: appliedPromo?.discountValue || 0,
//             total,
//             shippingAddress: formData,
//         });

//         await order.save();

//         // save coupon to user
//         if (appliedPromo?.code) {
//             await User.findByIdAndUpdate(userId, {
//                 $push: { usedCoupons: appliedPromo.code },
//             });
//         }

//         res.json({ message: "Order created successfully", order });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Failed to create order" });
//     }
// };




// export const createOrder = async (req, res) => {
//     try {
//         const { formData, appliedPromo, total, cartItems, shippingFee } = req.body;
//         const userId = req.user.id;

//         // Validate cartItems
//         if (!cartItems || cartItems.length === 0) {
//             return res.status(400).json({ message: "Cart is empty" });
//         }

//         // Recalculate subtotal from cart items
//         const subtotal = cartItems.reduce((sum, item) => {
//             return sum + item.price * item.quantity;
//         }, 0);

//         // Validate applied promo
//         let discount = 0;
//         if (appliedPromo?.code) {
//             if (appliedPromo.discountType === "fixed") {
//                 discount = Math.min(appliedPromo.discountValue, subtotal);
//             } else if (appliedPromo.discountType === "percentage") {
//                 discount = (subtotal * appliedPromo.discountValue) / 100;
//             }

//             // Check if coupon already used
//             const user = await User.findById(userId);
//             if (user.usedCoupons.includes(appliedPromo.code)) {
//                 return res.status(400).json({ message: "Coupon already used" });
//             }
//         }

//         const calculatedTotal = subtotal - discount + shippingFee;

//         if (calculatedTotal <= 0) {
//             return res.status(400).json({ message: "Invalid total after discounts" });
//         }

//         // Map cartItems to match schema with dynamic attributes
//         const orderItems = cartItems.map(item => ({
//             productId: item.productId || item.id,
//             variationId: item.variationId || null,
//             name: item.name,
//             price: item.price,
//             quantity: item.quantity,
//             totalPrice: item.totalPrice,
//             image: item.image,
//             // Use dynamic attributes instead of hardcoded size/color
//             attributes: item.attributes || {}
//         }));

//         // Create order
//         const newOrder = new orders({
//             user: userId,
//             items: orderItems,
//             shippingFee,
//             freeShippingOver: null,
//             coupon: appliedPromo || null,
//             subtotal,
//             discount,
//             total: calculatedTotal,
//             shippingAddress: formData,
//         });

//         await newOrder.save();

//         // Save coupon to user
//         if (appliedPromo?.code) {
//             await User.findByIdAndUpdate(userId, {
//                 $push: { usedCoupons: appliedPromo.code },
//             });
//         }

//         res.json({ message: "Order created successfully", order: newOrder });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Failed to create order" });
//     }
// };

export const createOrder = async (req, res) => {
    try {
        const { formData, appliedPromo, total, cartItems, shippingFee, freeShippingOver } = req.body;
        const userId = req.user.id;
        if (!userId) return res.json({ message: "User is not logged in!" })

        // Get current commerce data for accurate calculations
        const commerceData = await Commerce.findOne(); // Adjust model name as needed
        const currentFreeShippingThreshold = commerceData?.freeShippingOver || 5000;
        const currentShippingFee = commerceData?.shippingFee || 500;

        // Validate cartItems
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Recalculate subtotal from cart items
        const subtotal = cartItems.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        // Validate applied promo
        let discount = 0;
        if (appliedPromo?.code) {
            if (appliedPromo.discountType === "fixed") {
                discount = Math.min(appliedPromo.discountValue, subtotal);
            } else if (appliedPromo.discountType === "percentage") {
                discount = (subtotal * appliedPromo.discountValue) / 100;
            }

            // Check if coupon already used
            const user = await User.findById(userId);
            if (user.usedCoupons.includes(appliedPromo.code)) {
                return res.status(400).json({ message: "Coupon already used" });
            }
        }

        // Calculate shipping fee based on current rules
        const finalShippingFee = appliedPromo?.discountType === "free_shipping"
            ? 0
            : subtotal >= currentFreeShippingThreshold
                ? 0
                : currentShippingFee;

        const calculatedTotal = subtotal - discount + finalShippingFee;

        if (calculatedTotal <= 0) {
            return res.status(400).json({ message: "Invalid total after discounts" });
        }

        // Map cartItems to match schema with dynamic attributes
        const orderItems = cartItems.map(item => ({
            productId: item.productId || item.id,
            variationId: item.variationId || null,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            image: item.image,
            attributes: item.attributes || {}
        }));

        // Create order
        const newOrder = new orders({
            user: userId,
            items: orderItems,
            shippingFee: finalShippingFee,
            freeShippingOver: currentFreeShippingThreshold,
            coupon: appliedPromo || null,
            subtotal,
            discount,
            total: calculatedTotal,
            shippingAddress: formData,
        });

        await newOrder.save();

        // Save coupon to user and clear cart
        if (appliedPromo?.code) {
            await User.findByIdAndUpdate(userId, {
                $push: { usedCoupons: appliedPromo.code },
            });
        }

        // Clear user's cart after successful order
        await Cart.deleteMany({ userId }); // Adjust model name as needed
        await mail_c_new_cartOrder(newOrder.toObject())
        await mail_a_new_cartOrder(newOrder.toObject())

        res.json({ message: "Order created successfully", order: newOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create order" });
    }
};



// New endpoint for direct purchases from preview page
// export const createDirectOrder = async (req, res) => {
//     try {
//         const {
//             productId, productName, productImage, variationId,
//             variationAttributes, unitPrice, quantity, totalPrice,
//             deliveryFee, finalTotal, shippingAddress
//         } = req.body;

//         const userId = req.user?.id || null;
//         console.log("user id", userId)

//         // Get current commerce data
//         const commerceData = await Commerce.findOne();
//         const currentFreeShippingThreshold = commerceData?.freeShippingOver || 5000;
//         const currentShippingFee = commerceData?.shippingFee || 500;

//         // Calculate actual shipping fee
//         const actualShippingFee = totalPrice >= currentFreeShippingThreshold ? 0 : currentShippingFee;
//         const actualTotal = totalPrice + actualShippingFee;

//         // Create order
//         const newOrder = new orders({
//             user: userId,
//             items: [{
//                 productId: productId,
//                 variationId: variationId,
//                 name: productName,
//                 price: unitPrice,
//                 quantity: quantity,
//                 totalPrice: totalPrice,
//                 image: productImage,
//                 attributes: variationAttributes
//             }],
//             shippingFee: actualShippingFee,
//             freeShippingOver: currentFreeShippingThreshold,
//             subtotal: totalPrice,
//             discount: 0,
//             total: actualTotal,
//             shippingAddress: shippingAddress,
//         });

//         await newOrder.save();

//         res.json({
//             message: "Order placed successfully",
//             order: newOrder
//         });

//     } catch (error) {
//         console.error("Error creating direct order:", error);
//         res.status(500).json({ message: "Failed to create order" });
//     }
// };

export const createDirectOrder = async (req, res) => {
    try {
        const {
            productId, productName, productImage, variationId,
            variationAttributes, unitPrice, quantity, totalPrice,
            deliveryFee, finalTotal, shippingAddress
        } = req.body;

        const userId = req.user?.id || null;
        console.log("user id", userId)

        // Get current commerce data 
        const commerceData = await Commerce.findOne();
        const currentFreeShippingThreshold = commerceData?.freeShippingOver || 5000;
        const currentShippingFee = commerceData?.shippingFee || 500;

        // Calculate actual shipping fee 
        const actualShippingFee = totalPrice >= currentFreeShippingThreshold ? 0 : currentShippingFee;
        const actualTotal = totalPrice + actualShippingFee;

        // Create order data conditionally
        const orderData = {
            items: [{
                productId: productId,
                variationId: variationId,
                name: productName,
                price: unitPrice,
                quantity: quantity,
                totalPrice: totalPrice,
                image: productImage,
                attributes: variationAttributes
            }],
            shippingFee: actualShippingFee,
            freeShippingOver: currentFreeShippingThreshold,
            subtotal: totalPrice,
            discount: 0,
            total: actualTotal,
            shippingAddress: shippingAddress,
        };

        // Only add user field if user is logged in
        if (userId) {
            orderData.user = userId;
        }

        // Create order 
        const newOrder = new orders(orderData);

        await newOrder.save();
        await orderConfirmation(newOrder)
        await newOrderAlert(newOrder)
        res.json({
            message: "Order placed successfully",
            order: newOrder
        });

    } catch (error) {
        console.error("Error creating direct order:", error);
        res.status(500).json({ message: "Failed to create order" });
    }
};

export const getOrders = async (req, res) => {
    try {
        const userId = req.user?.id
        const allOrders = await orders.find({ user: userId });
        res.json(allOrders)
    } catch (error) {
        console.log(error)
    }
}
export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id; // comes from protect middleware

        // Find the order
        const order = await orders.findOne({ orderNumber: id });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // ✅ Only the owner can cancel
        if (order.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to cancel this order" });
        }

        // ✅ Only pending orders can be cancelled
        if (order.status !== "pending" && order.status !== "processing") {
            return res.status(400).json({ message: "Order cannot be cancelled at this stage" });
        }

        // ✅ Update status
        order.status = "cancelled";
        await order.save();

        await orderCancellation(order)
        res.json({
            message: "Order cancelled successfully",
            order,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to cancel order" });
    }
};

export const fetchOrder = async (req, res) => {
    try {
        console.log(req.params)
        const order = await orders.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Verify the order belongs to the user
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch order" });
    }
}
