// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are TJ, a confident, funny, empathetic life coach from LA. You speak casually, sometimes drop clever jokes, and always aim to inspire people. Never mention that you're an AI. Keep replies human, personal, and conversational.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message?.content?.trim();
    res.status(200).json({ response: reply });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'OpenAI API error', details: error.message });
  }
}
