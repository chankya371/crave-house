import Food from "../models/Food.js";

// ================= ADD FOOD =================
export const addFood = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ multiple images
    const images = req.files
      ? req.files.map(file => `/uploads/${file.filename}`)
      : [];

    const food = await Food.create({
      name,
      price: Number(price),
      category,
      description,
      images,
    });

    res.json(food);

  } catch (error) {
    console.error("ADD FOOD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL FOOD =================
export const getAllFood = async (req, res) => {
  try {
    let { page = 1, limit = 5 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const total = await Food.countDocuments();

    const food = await Food.find()
      .populate("category", "name image")
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: food,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching food" });
  }
};

// ================= GET FOOD BY CATEGORY =================
export const getFoodByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const food = await Food.find({
      category: categoryId,
    }).populate("category", "name");

    res.json({
      success: true,
      data: food,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching food",
    });
  }
};

// ================= DELETE FOOD =================
export const deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting food" });
  }
};


// ================= UPDATE FOOD =================
export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description } = req.body;

    const updateData = {
      name,
      price,
      category,
      description,
    };

    // ✅ FIX: safe check
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      updateData.images = req.files.map(
        (file) => `/uploads/${file.filename}`
      );
    }

    const updatedFood = await Food.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("category", "name");

    res.json(updatedFood);

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({ message: "Error updating food" });
  }
};

export const getSingleFood = async (req, res) => {
  const food = await Food.findById(req.params.id);
  res.json(food);
};