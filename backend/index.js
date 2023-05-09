const express = require("express");
const { createApi } = require("unsplash-js");
require("dotenv").config();
const cors = require("cors");

// This is the backend code of this mobile app.

// here we are creating a new express app or basically a server
const app = express();

(async () => {
  const fetch = await import("node-fetch").then((module) => module.default);

  // creating an instance of the unsplash api
  const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
    fetch: fetch // Provide the custom fetch implementation
  });

  // this is to allow network connections to our server
  app.use(
    cors({
      origin: "*"
    })
  );

  // here we are calling the unsplash api and passing in the search term from the frontend
  // specifically the PantryItem.js
  app.get("/api/unsplash/:searchTerm", async (req, res) => {
    console.log("Request received:", req.params.searchTerm);
    const searchTerm = req.params.searchTerm;
    try {
      const result = await unsplash.search.getPhotos({
        query: searchTerm,
        perPage: 1
      });

      console.log("Unsplash API result:", result);

      if (result.errors) {
        console.error("Error searching Unsplash:", result.errors);
        res.status(500).json({ errors: result.errors });
      } else {
        const imageUrl = result.response.results[0].urls.small;
        console.log(imageUrl);
        res.json({ imageUrl });
      }
    } catch (error) {
      console.error("Error searching Unsplash:", error);
      res.status(500).json({ error });
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
})();
