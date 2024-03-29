// Import the OpenAI SDK using the new approach
const OpenAI = require('openai');

// Instantiate the OpenAI client directly with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this environment variable is set in your Vercel project settings
});

module.exports = async (req, res) => {
    console.log('Received request:', req.body);
  if (req.method === 'POST') {
    try {
      const { question } = req.body;
      console.log('Question received for embedding:', question);

      // Adjust the API call according to the latest SDK documentation and your use case
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: question,
      });

      console.log('OpenAI response:', response.data);
      // Extract the embedding from the response and return it
      const [{embedding}] = response.data;

      const categories = ["Poverty", "Health", "Advice", "Education", "Environment"];
      const prompt = `Question: "${question}"\nCategorize this question into one of the following categories: ${categories.join(", ")}. If you cannot find a category that closely matches the question you should attempt to create a new category. Category: \n`;
      console.log(prompt);
      
      const categoryResponse = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct", // Adjust based on your categorization needs
        prompt: prompt,
        
      });

      console.log('Category response:', categoryResponse);
      const category = categoryResponse.choices[0].text.trim();
      console.log("Category:", category);

      

      res.status(200).json({ embedding, category });
    } catch (error) {
      console.error('Error generating embedding:', error);
      res.status(500).json({ message: 'Failed to generate embedding', error: error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
};
