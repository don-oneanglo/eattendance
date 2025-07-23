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

const AuthenticateTeacherInputSchema = z.object({
  teacherImageDataUri: z
    .string()
    .describe(
      'A photo of the teacher as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  knownTeacherList: z.array(z.string()).describe('List of all teachers in the system.'),
});
export type AuthenticateTeacherInput = z.infer<typeof AuthenticateTeacherInputSchema>;

const AuthenticateTeacherOutputSchema = z.object({
  teacherName: z
    .string()
    .optional()
    .describe('The name of the teacher if identified, otherwise undefined.'),
});
export type AuthenticateTeacherOutput = z.infer<typeof AuthenticateTeacherOutputSchema>;

export async function authenticateTeacher(input: AuthenticateTeacherInput): Promise<AuthenticateTeacherOutput> {
  return authenticateTeacherFlow(input);
}

const authenticateTeacherPrompt = ai.definePrompt({
  name: 'authenticateTeacherPrompt',
  input: {schema: AuthenticateTeacherInputSchema},
  output: {schema: AuthenticateTeacherOutputSchema},
  prompt: `You are an AI security guard for a school. You are given a photo of a person trying to log in and a list of all registered teachers.
Your task is to identify if the person in the photo is one of the registered teachers.
If you find a match, return the teacher's name. If there is no match, do not return a name.

Teacher Photo:
{{media url=teacherImageDataUri}}

Registered Teachers: {{{knownTeacherList}}}

Identified Teacher Name:`,
});

const authenticateTeacherFlow = ai.defineFlow(
  {
    name: 'authenticateTeacherFlow',
    inputSchema: AuthenticateTeacherInputSchema,
    outputSchema: AuthenticateTeacherOutputSchema,
  },
  async input => {
    const {output} = await authenticateTeacherPrompt(input);
    return output!;
  }
);
