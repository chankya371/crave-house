import express from "express";
import axios from "axios";
import { searchLocation } from "../services/locationService.js";
import { getAddressFromCoords } from "../services/locationService.js";


const router = express.Router();

router.post(
  "/reverse-geocode",
  async (req, res) => {
    try {
      const { lat, lng } = req.body;

      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          message:
            "Latitude and Longitude are required",
        });
      }

      const locationData =
        await getAddressFromCoords(
          lat,
          lng
        );

      res.status(200).json({
        success: true,
        ...locationData,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    const results = await searchLocation(q);

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;