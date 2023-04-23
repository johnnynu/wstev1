const fetchUnsplashImage = async (searchTerm) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/unsplash/${searchTerm}`
    );

    if (response.ok) {
      const data = await response.json();
      return data.imageUrl;
    }
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);
  }

  return null;
};

export { fetchUnsplashImage };
