"use server";

/**
 * @fileOverview A flow for registering a person's face for recognition.
 *
 * - registerFaceFlow - A function that saves face data to the database.
 * - RegisterFaceInput - The input type for the registerFaceFlow function.
 * - RegisterFaceOutput - The return type for the registerFaceFlow function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";
import { getConnection } from "@/lib/db";

const RegisterFaceInputSchema = z.object({
  personType: z.enum(["student", "teacher"]),
  personCode: z.string().describe("The code/ID of the person."),
  imageDataUri: z
    .string()
    .describe(
      "A photo of the person as a data URI that must include a MIME type and use Base64 encoding."
    ),
  originalName: z.string().describe("The name of the file, if available."),
});
export type RegisterFaceInput = z.infer<typeof RegisterFaceInputSchema>;

const RegisterFaceOutputSchema = z.object({
  success: z.boolean(),
});
export type RegisterFaceOutput = z.infer<typeof RegisterFaceOutputSchema>;

export const registerFaceFlow = ai.defineFlow(
  {
    name: "registerFaceFlow",
    inputSchema: RegisterFaceInputSchema,
    outputSchema: RegisterFaceOutputSchema,
  },
  async (input) => {
    try {
      const { personType, personCode, imageDataUri, originalName } = input;
      
      const mimeTypeMatch = imageDataUri.match(/data:(image\/\w+);base64,/);
      if (!mimeTypeMatch) {
          throw new Error("Invalid image data URI format. Could not determine MIME type.")
      }
      const contentType = mimeTypeMatch[1];
      const base64Data = imageDataUri.split(",")[1];
      const imageBuffer = Buffer.from(base64Data, 'base64');

      const db = await getConnection();
      await db.execute(
          `INSERT INTO FaceData (PersonType, PersonCode, ImageData, OriginalName, ContentType) 
           VALUES (?, ?, ?, ?, ?)`,
          [personType, personCode, imageBuffer, originalName, contentType]
        );

      return { success: true };
    } catch (error) {
      console.error("Error in registerFaceFlow:", error);
      // In a real app, you would have more robust error logging.
      return { success: false };
    }
  }
);
