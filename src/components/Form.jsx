import { useState, useEffect } from "react";

const Form = () => {
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [meme, setMeme] = useState(null);
  const [textColor, setTextColor] = useState("white");
  const [language, setLanguage] = useState("en");

  const languages = {
    en: {
      topText: "Top Text",
      bottomText: "Bottom Text",
      buttonText: "Click here to Generate your Meme Image",
    },
    es: {
      topText: "Texto Superior",
      bottomText: "Texto Inferior",
      buttonText: "Haz clic aquí para generar tu imagen de meme",
    },
    fr: {
      topText: "Texte Supérieur",
      bottomText: "Texte Inférieur",
      buttonText: "Cliquez ici pour générer votre image de mème",
    },
    // Add more languages as needed
  };

  const fetchMeme = async () => {
    try {
      const response = await fetch("https://api.imgflip.com/get_memes");
      const data = await response.json();
      const memes = data.data.memes;
      const randomMeme = memes[Math.floor(Math.random() * memes.length)];
      setMeme(randomMeme.url);
    } catch (error) {
      console.error("Error fetching meme:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchMeme();
  };

  const calculateImageBrightness = (imageUrl) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let r, g, b, avg;
      let colorSum = 0;

      for (let i = 0; i < data.length; i += 4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];
        avg = Math.floor((r + g + b) / 3);
        colorSum += avg;
      }

      const brightness = Math.floor(colorSum / (img.width * img.height));
      if (brightness > 127) {
        setTextColor("black");
      } else {
        setTextColor("white");
      }
    };
  };

  useEffect(() => {
    if (meme) {
      calculateImageBrightness(meme);
    }
  }, [meme]);

  return (
    <div className="py-7 bg-white">
      <div className="mb-4 flex justify-center">
        <label htmlFor="language" className="mr-2">Select Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border border-gray-600 rounded-md h-8 bg-white text-black p-2"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex">
          <div className="flex flex-col w-1/2 items-center">
            <label htmlFor="topText" className="text-sm font-medium self-start ml-20 hidden md:flex">
              {languages[language].topText}
            </label>
            <input
              type="text"
              id="topText"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder={languages[language].topText}
              className="border border-gray-600 w-3/4 rounded-md h-8 bg-white placeholder:text-black text-black text-sm p-2 placeholder:text-sm focus:outline-none"
            />
          </div>

          <div className="flex flex-col w-1/2 items-center">
            <label htmlFor="bottomText" className="text-sm font-medium hidden md:flex self-start ml-20">
              {languages[language].bottomText}
            </label>
            <input
              type="text"
              id="bottomText"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder={languages[language].bottomText}
              className="border border-gray-600 w-3/4 rounded-md h-8 bg-white placeholder:text-black text-black text-sm placeholder:text-sm p-2 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex w-full justify-center items-center mt-8">
          <button className="w-2/4 bg-violet-700 h-10 text-white rounded-full" type="submit">
            {languages[language].buttonText}
          </button>
        </div>
      </form>

      {meme && (
        <div className="relative mt-8 w-full max-w-md mx-auto">
          <img src={meme} alt="Meme" className="w-full h-auto" />
          <div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center drop-shadow-md"
            style={{ color: textColor, fontWeight: "bold", fontSize: "2em" }}
          >
            {topText}
          </div>
          <div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center drop-shadow-md"
            style={{ color: textColor, fontWeight: "bold", fontSize: "2em" }}
          >
            {bottomText}
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
