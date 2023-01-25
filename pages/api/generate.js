import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const { char_name, char_age, char_gender, char_race, char_class, char_alignment, char_description } = req.body;
  // Validate the input
  if (char_name.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid name",
      }
    });
    return;
  }

  try {
    const backstory = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateBackstoryPrompt(char_name, char_age, char_gender, char_race, char_class, char_alignment, char_description),
      temperature: 0.35,
      max_tokens: 400,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.35
    });
    /*
    const description = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateDescriptionPrompt(char_name, backstory.data.choices[0].text),
      temperature: 0.75,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.2
    });
    const organization = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateOrganizationsPrompt(char_name, backstory.data.choices[0].text, description.data.choices[0].text),
      temperature: 0.25,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.2
    });
    const relationships = await openai.createCompletion({
      model: "text-daVinci-003",
      prompt: generateAlliesAndEnemiesPrompt(char_name, backstory.data.choices[0].text, description.data.choices[0].text, organization.data.choices[0].text),
      temperature: 0.5,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.2
    });
    */
    res.status(200).json({ backstory: backstory.data.choices[0].text });

  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateBackstoryPrompt(char_name, char_age, char_gender, char_race, char_class, char_alignment, char_description) {
  let char_age_text = "the " + char_age + " years old,";
  if (isNaN(char_age)) char_age_text = char_age;

  let char_class_text = "Class: " + char_class;
  if (char_class === "") char_class_text = "";

  let char_alignment_text = "Alignment: " + char_alignment;
  if (char_alignment === "") char_alignment_text = "";

  return `Write a backstory for ${capitalize(char_name)} ${char_age_text} ${char_gender} ${char_race}:

${char_class_text}
${char_alignment_text}

${char_description}`;
}

function generateDescriptionPrompt(char_name, backstory) {
  return `Write a description for ${capitalize(char_name)}:

${backstory}`;
}

function generateAlliesAndEnemiesPrompt(char_name, backstory, description, organization) {
  return `Write about ${capitalize(char_name)}'s allies and enemies:

${backstory}

${description}

${organization}`;
}

function generateOrganizationsPrompt(char_name, backstory, description) {
  return `Write about ${capitalize(char_name)}'s related organization:

${backstory}

${description}`;
}
