"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function generateForm(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const schema = z.object({
    description: z.string().min(1),
  });
  const parse = schema.safeParse({
    description: formData.get("description"),
  });

  console.log(parse); 
  if (!parse.success) {
    console.log(parse.error);
    return {
      message: "failed to parse data",
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      message: "No OpenAI API key found",
    };
  }

  const data = parse.data;
  const promptExplanation = "Generate a survey."; 

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `${data.description} ${promptExplanation}`,
          },
        ],
      }),
    });
    const json = await response.json();
    revalidatePath("/");

    return {
      message: "success",
      data: json,
    };
  } catch (e) {
    console.error(e);
    return {
      message: "failed to create form",
    };
  }
}
