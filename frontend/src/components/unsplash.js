// passing in the search team from our pantryitem.js page
// to generate a stock photo.
const fetchUnsplashImage = async (searchTerm) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/unsplash/${searchTerm}`
    ).catch((error) => {
      console.error("Network error:", error);
    });
    if (response.ok) {
      const data = await response.json();
      return data.imageUrl;
    } else {
      console.error("Error fetching Unsplash image: ", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);
  }

  return null;
};

export { fetchUnsplashImage };
