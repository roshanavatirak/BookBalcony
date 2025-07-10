const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const {authenticateToken} = require("./userAuth");

// add book -- admin - post (admin api)
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied: Admin privileges required" });
    }

    const {
      url,
      title,
      author,
      price,
      desc,
      language,
      category,
      editionOrPublishYear,
      stock,
    } = req.body;

    // Basic validation (can be extended)
    if (!url || !title || !author || !price || !desc || !language) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newBook = new Book({
      url,
      title,
      author,
      price,
      desc,
      language,
      category: category || "General",
      editionOrPublishYear: editionOrPublishYear || "N/A",
      stock: stock || 1,
      seller: user._id,
    });

    await newBook.save();

    return res.status(200).json({ message: "✅ Book added successfully!" });
  } catch (error) {
    console.error("❌ Error during admin book addition:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//update book put (admin api's)
router.put("/update-book", authenticateToken, async (req, res) =>{
    try {
        const{bookid} = req.headers;
        await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author:req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });

        return res.status(200).json({
            message: "Book Updated SuccessFully",
        });
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"An error occurred"});
        
    }
});


//delete book -- admin - delete  (admin api's)
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try{
        const {bookid} = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({
           message: "Book deleted successfully", 
        });
    } catch (error){
        // console.log(error);
        return res.status(500).json({message: "An error occurred"});
    }
});



//get all books ( public api's)
router.get("/get-all-books", async(req, res) =>{
    try {
        const books = await Book.find().sort({createdAt : -1});
        return res.json({
            status:"Success",
            data:books,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"An error occurred"});
        
    }
});

//get recently added books limit 4  ( public api's)
router.get("/get-recent-books", async(req, res) =>{
    try {
        const books = await Book.find().sort({createdAt : -1}).limit(20);
        return res.json({
            status:"Success",
            data:books,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"An error occurred"});
        
    }
});


// GET trending books (sorted by views or sales or any custom field)
router.get("/get-trending-books", async (req, res) => {
  try {
    // Example logic: Assuming you have a 'views' or 'sold' field to determine trending
    const books = await Book.find().sort({ views: -1 }).limit(10); // You can change `views` to `sold` or any metric
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});


router.get("/get-editors-choice", async (req, res) => {
  try {
    const books = await Book.find().sort({ sold: -1 }).limit(4); // you can change logic
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});


//get book by id  ( public api's)
router.get("/get-book-by-id/:id", async(req, res) =>{
    try {
       const{id} = req.params;
       const book = await Book.findById(id);
       return res.json({
        status: "Success",
        data: book,
       }) ;

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"An error occurred"});
    }
});



module.exports = router;