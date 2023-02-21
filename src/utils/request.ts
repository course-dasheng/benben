import { Configuration, OpenAIApi } from "openai";
import Process from "process";
interface Choice {
  text: string;
  index: number;
  logprobs: string | null;
  finish_reason: string;
}
export interface Response {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

type Request = (query: Query) => any;
interface Query {
  programmingLanguage: string;
  language: string;
  functions: string;
}

const configuration = new Configuration({
  apiKey: Process.env["OPENAI_API_KEY"] as string,
});
const openai = new OpenAIApi(configuration);

export const request: Request = async (query: Query) => {
  console.log(query, Process.env);
  if (!configuration.apiKey) {
    console.error(
      "OpenAI API key not configured, please follow instructions in README.md"
    );
    return;
  }
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(query),
      temperature: 1,
      max_tokens: 20,
    });
    console.log({ result: JSON.stringify(response) });
    return response.data;
  } catch (error) {
    // Consider adjusting the error handling logic for use case
    if ((error as Error).message) {
      console.error((error as Error).message);
    } else {
      console.error(
        `Error with OpenAI API request: ${(error as Error).message}`
      );
    }
    return { error };
  }
};

function generatePrompt({ functions, programmingLanguage, language }: Query) {
  return `Deliver me some library for ${functions} functions in ${programmingLanguage} language with a short description and source code address, answer me in ${language}`;
}

// let response.data = {
//   result: {
//     id: "cmpl-6mDgsbCU6k1FWwRzrYUXvt1lbnrzw",
//     object: "text_completion",
//     created: 1676950390,
//     model: "text-davinci-003",
//     choices: [
//       {
//         text: "\\n\\n1. Lodash",
//         index: 0,
//         logprobs: null,
//         finish_reason: "length",
//       },
//     ],
//     usage: { prompt_tokens: 25, completion_tokens: 6, total_tokens: 31 },
//   },
// };
