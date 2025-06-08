const router = require("express").Router();
const { authenticateToken}= require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");

//place order
router.post("/place-order", authenticateToken, async(req ,res)=>{
    try{
        const {id}= req.headers;
        const {order}=req.body;
        for(const orderData of order){
            const newOrder = new Order({user: id, book: orderData._id});
            const orderDataFromDb = await newOrder.save();

            await User.findByIdAndUpdate(id,{
                $push:{orders:orderDataFromDb._id},
            });

            await User.findByIdAndUpdate(id,{
                $pull: {cart:orderData._id},
            });
        }

        return res.json({
            status:"Success",
            message:"Order Placed Successfully",
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({message: "An error occurred"});
    }
});

//get order history of particular user
router.get("/get-order-history", authenticateToken, async (req, res)=>{
    try{
        const {id}= req.headers;
        const userData = await User.findById().populate({
            path:"orders",
            populate:{path:"book"},
        });

        const ordersData= userData.orders.reverse();
        return res.json({
            status:"Success",
            data:ordersData,
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({message:"An error occurred"});
    }
});

//get-all-orders --admin
router.get("/get-all-orders", authenticateToken, async(req, res)=>{
    try{
        const userData= await Order.find().populate({
            path:"book",

        }).populate({
            path:"user",
        }).sort({createdAt:-1});
        return res.json({
            status:"Success",
            data:userData,
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({message:"An error occurred"});
    }
});

//update order --admin
// router.put("/update-status/:id", authenticateToken, async(req, res)=>{
//     try{
//         const {id}= req.params;
//         await Order.findByIdAndUpdate(id, {status:req.body.status});
//         return res.json({
//             status:"Success",
//             message:"Status Updated Successfully",
//         });
//     } catch (error){
//         console.log(error);
//         return res.status(500).json({message:"An error occurred"});
//     }
// });

// Update order status --admin only
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;

    // ✅ Admin Check
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        status: "Error",
        message: "Access denied. Admins only.",
      });
    }

    // ✅ Normalize status input (capitalize properly)
    status = status?.trim();

    const allowedStatuses = [
      "Order Placed",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ];

    // ✅ Validate status
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: "Error",
        message: `Invalid status. Allowed values are: ${allowedStatuses.join(", ")}`,
      });
    }

    // ✅ Update order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        status: "Error",
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: `Order status updated to '${status}'.`,
      data: updatedOrder,
    });

  } catch (error) {
    console.error("Order status update error:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error.",
    });
  }
});


module.exports= router;