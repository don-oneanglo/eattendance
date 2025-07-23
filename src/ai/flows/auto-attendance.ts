'use server';

/**
 * @fileOverview Implements the auto attendance feature using facial recognition.
 *
 * - autoAttendance - A function that handles the automatic attendance marking process.
 * - AutoAttendanceInput - The input type for the autoAttendance function.
 * - AutoAttendanceOutput - The return type for the autoAttendance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoAttendanceInputSchema = z.object({
  studentImageDataUris: z
    .array(z.string())
    .describe(
      'An array of student photos as data URIs that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  knownStudentList: z.array(z.string()).describe('List of enrolled students.'),
});
export type AutoAttendanceInput = z.infer<typeof AutoAttendanceInputSchema>;

const AutoAttendanceOutputSchema = z.object({
  presentStudents: z
    .array(z.string())
    .describe('List of students identified as present.'),
});
export type AutoAttendanceOutput = z.infer<typeof AutoAttendanceOutputSchema>;

export async function autoAttendance(input: AutoAttendanceInput): Promise<AutoAttendanceOutput> {
  return autoAttendanceFlow(input);
}

const autoAttendancePrompt = ai.definePrompt({
  name: 'autoAttendancePrompt',
  input: {schema: AutoAttendanceInputSchema},
  output: {schema: AutoAttendanceOutputSchema},
  prompt: `You are an AI attendance taker. You are given a list of
student face photos and a list of enrolled student names. For each face, if the face belongs to a student in the enrolled student list, add the student's name to the list of present students.

Student Photos:
{{#each studentImageDataUris}}
  {{media url=this}}
{{/each}}

Enrolled Students: {{{knownStudentList}}}

Present Students:`, // The prompt is updated to include the list of enrolled students
});

const autoAttendanceFlow = ai.defineFlow(
  {
    name: 'autoAttendanceFlow',
    inputSchema: AutoAttendanceInputSchema,
    outputSchema: AutoAttendanceOutputSchema,
  },
  async input => {
    const {output} = await autoAttendancePrompt(input);
    return output!;
  }
);
