import { useState, useEffect } from "react";

const Form = () => {
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [meme, setMeme] = useState(null);
  const [textColor, setTextColor] = useState("white"); // State to hold text color

  // Function to fetch a random meme image from an API
  const fetchMeme = async () => {
    try {
      const response = await fetch("https://api.imgflip.com/get_memes");
      const data = await response.json();
      const memes = data.data.memes;
      const randomMeme = memes[Math.floor(Math.random() * memes.length)];
      setMeme(randomMeme.url); // Set the random meme image URL
    } catch (error) {
      console.error("Error fetching meme:", error);
    }
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchMeme(); // Fetch new meme when the button is clicked
  };

  // Function to calculate average brightness of the image
  const calculateImageBrightness = (imageUrl) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // To handle cross-origin images
    img.src = imageUrl;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image on the canvas
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let r, g, b, avg;
      let colorSum = 0;

      // Loop through all pixels
      for (let i = 0; i < data.length; i += 4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];

        avg = Math.floor((r + g + b) / 3);
        colorSum += avg;
      }

      // Calculate average brightness
      const brightness = Math.floor(colorSum / (img.width * img.height));

      // Set text color based on brightness
      if (brightness > 127) {
        setTextColor("black"); // Dark background, light text
      } else {
        setTextColor("white"); // Light background, dark text
      }
    };
  };

  // When the meme image changes, calculate its brightness
  useEffect(() => {
    if (meme) {
      calculateImageBrightness(meme);
    }
  }, [meme]);

  return (
    <div className="py-7 bg-white">
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <div className="flex flex-col w-1/2 items-center">
            <label htmlFor="topText" className="text-sm font-medium self-start ml-20 hidden md:flex">
              Top Text
            </label>
            <input
              type="text"
              id="topText"
              value={topText}
              onChange={(e) => setTopText(e.target.value)} // Update state for top text
              placeholder="Top text"
              className="border border-gray-600 w-3/4 rounded-md h-8 bg-white placeholder:text-black text-black text-sm p-2 placeholder:text-sm focus:outline-none"
            />
          </div>

          <div className="flex flex-col w-1/2 items-center">
            <label htmlFor="bottomText" className="text-sm font-medium hidden md:flex self-start ml-20">
              Bottom Text
            </label>
            <input
              type="text"
              id="bottomText"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)} // Update state for bottom text
              placeholder="Bottom Text"
              className="border border-gray-600 w-3/4 rounded-md h-8 bg-white placeholder:text-black text-black text-sm placeholder:text-sm p-2 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex w-full justify-center items-center mt-8">
          <button className="w-3/4 bg-violet-700 h-10 text-white rounded-lg" type="submit">
            Get a new Meme Image
          </button>
        </div>
      </form>

      {meme && (
        <div className="relative mt-8 w-full max-w-md mx-auto">
          <img src={meme} alt="Meme" className="w-full h-auto" />
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center drop-shadow-md" style={{ color: textColor, fontWeight: "bold", fontSize: "2em" }}>
            {topText}
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center drop-shadow-md" style={{ color: textColor, fontWeight: "bold", fontSize: "2em" }}>
            {bottomText}
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
