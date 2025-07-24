import { config } from 'dotenv';
config();

import '@/ai/flows/auto-attendance.ts';
import '@/ai/flows/authenticate-teacher.ts';
import '@/ai/flows/register-face.ts';
