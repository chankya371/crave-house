import Category from "../models/Category.js";

// ➕ Add Category
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`   // ✅ FIXED
      : null;

    const category = await Category.create({
      name,
      description,
      image,
    });

    res.json(category);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding category" });
  }
};

// 📥 Get Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
   
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// ❌ Delete Category
export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};

// ✏️ Update Category
export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`   // ✅ FIXED
      : null;

    const updatedData = { name, description };
    if (image) updatedData.image = image;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(category);

  } catch (error) {
    res.status(500).json({ message: "Error updating category" });
  }
};