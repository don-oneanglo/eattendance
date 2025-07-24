'use server';

/**
 * @fileOverview Implements teacher authentication using facial recognition.
 *
 * - authenticateTeacher - A function that handles the teacher authentication process.
 * - AuthenticateTeacherInput - The input type for the authenticateTeacher function.
 * - AuthenticateTeacherOutput - The return type for the authenticateTeacher function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getConnection, sql } from '@/lib/db';

const AuthenticateTeacherInputSchema = z.object({
  teacherCode: z.string().describe("The unique code of the teacher trying to log in."),
  loginImageDataUri: z
    .string()
    .describe(
      'A photo of the person trying to log in, as a data URI.'
    ),
});
export type AuthenticateTeacherInput = z.infer<typeof AuthenticateTeacherInputSchema>;

const AuthenticateTeacherOutputSchema = z.object({
  isMatch: z.boolean().describe("Whether the face in the login photo matches the teacher's registered face.")
});
export type AuthenticateTeacherOutput = z.infer<typeof AuthenticateTeacherOutputSchema>;

export async function authenticateTeacher(input: AuthenticateTeacherInput): Promise<AuthenticateTeacherOutput> {
  return authenticateTeacherFlow(input);
}

const getRegisteredFacePrompt = ai.definePrompt({
    name: 'getRegisteredFacePrompt',
    input: { schema: z.object({
        registeredTeacherPhoto: z.string().describe('The registered photo of the teacher from the database.'),
        loginPhoto: z.string().describe('The photo of the person trying to log in now.'),
    })},
    output: {schema: z.object({
        isMatch: z.boolean().describe('Whether the two faces are a match.'),
    })},
    prompt: `You are a highly accurate AI face verification system. You will be given two images.
The first is a trusted, registered photo of a person from a database.
The second is a photo of a person attempting to log in right now.

Your task is to determine if the person in the login photo is the SAME person as in the registered photo.

- If they are the same person, you MUST set isMatch to true.
- If they are different people, you MUST set isMatch to false.

Registered Photo:
{{media url=registeredTeacherPhoto}}

Login Photo:
{{media url=loginPhoto}}
`,
});

const authenticateTeacherFlow = ai.defineFlow(
  {
    name: 'authenticateTeacherFlow',
    inputSchema: AuthenticateTeacherInputSchema,
    outputSchema: AuthenticateTeacherOutputSchema,
  },
  async ({ teacherCode, loginImageDataUri }) => {
    
    // 1. Fetch the registered face data from the database
    const pool = await getConnection();
    const result = await pool.request()
        .input('PersonCode', sql.NVarChar, teacherCode)
        .input('PersonType', sql.NVarChar, 'teacher')
        .query('SELECT ImageData, ContentType FROM FaceData WHERE PersonCode = @PersonCode AND PersonType = @PersonType');

    if (result.recordset.length === 0) {
        throw new Error(`No registered face found for teacher ${teacherCode}. Please register the teacher's face first.`);
    }

    const faceData = result.recordset[0];
    const registeredImageData = Buffer.from(faceData.ImageData).toString('base64');
    const registeredImageMimeType = faceData.ContentType;
    const registeredImageDataUri = `data:${registeredImageMimeType};base64,${registeredImageData}`;
    
    // 2. Call the AI model to compare the faces
    const { output } = await getRegisteredFacePrompt({
        registeredTeacherPhoto: registeredImageDataUri,
        loginPhoto: loginImageDataUri
    });

    if (!output) {
      return { isMatch: false };
    }

    return output;
  }
);
