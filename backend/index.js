const express = require("express");
const { createApi } = require("unsplash-js");
require("dotenv").config();
const cors = require("cors");

const app = express();

(async () => {
  const fetch = await import("node-fetch").then((module) => module.default);

  const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
    fetch: fetch // Provide the custom fetch implementation
  });

  app.use(cors());

  app.get("/api/unsplash/:searchTerm", async (req, res) => {
    const searchTerm = req.params.searchTerm;

    try {
      const result = await unsplash.search.getPhotos({
        query: searchTerm,
        perPage: 1
      });

      if (result.errors) {
        console.error("Error searching Unsplash:", result.errors);
        res.status(500).json({ errors: result.errors });
      } else {
        const imageUrl = result.response.results[0].urls.small;
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
