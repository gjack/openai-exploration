## How to use the code in this repo

 After cloning this repo, run `npm install` in both the main directory and the `frontend` directory to install all dependencies.

 If you don't have one already, get yourself an [openai](https://platform.openai.com/) account and create an API key. You will need this API key to run the demos in this code.

 Inside the main directory, create an `.env` file and place in it your environment variables for 
 PORT, BASE_URL, and OPENAI_API_KEY. 
 
 Note: In development, I have the node server running in port 3001. The React app runs in port 3000. You can use these same values or adjust them as needed.

 ```
   PORT=3001
   BASE_URL=http://localhost:3001
   OPENAI_API_KEY=Your-openai-API-key
 ```

 Assuming the React app is running on `localhost:3000`, run `npm start` from both, the main directory and the frontend directory, and head to `http://localhost:3000` to see a demo of completions using the `text-davinci-003` model. 
 
 Heading to `http://localhost:3000/stream` will show you a demo of streamed completions using the same `text-davinci-003` model. These two demos have a `max_tokens` value of 50, so keep your prompts short or increase the value or `max_tokens`. 😄 
 
 Heading over to `http://localhost:3000/pdfsummary` will show a demo of pdf summarization using the `gpt-3.5-turbo` model. This model is a bit more generous with the amount of maximum tokens allowed, but all models rate limit heavily, unless you're in a paid plan, so try to keep it to short PDFs of one or two pages maximum. Note that you will have to create a folder called `pdfsummaryfiles` inside the `backend` directory. This is where the uploads will be saved.

 Use of functions demo requires an api key with [weatherapi](https://www.weatherapi.com/). You can sign up for a free account with them. In your .env file, add a new environment variable for `WEATHER_API_KEY` for your api key for the service. Find the demo at `http://localhost:3000/function_chats`. To see the result of the function, your prompt should be something like `What's the weather like in <name of city>?`. In addition, you can ask for the temperature to be in Celsius or Fahrenheit. 

 More information about rate limits in the free tier can be found [here](https://platform.openai.com/docs/guides/rate-limits?context=tier-free). To learn more about what tokens are and how chatgpt separates text into tokens, visit the [tokenizer](https://platform.openai.com/tokenizer) page.

 This project uses the [openai](https://github.com/openai/openai-node) node library. 