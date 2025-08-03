import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are Dr. Arvin Jenab, ND, Medical Director of Naturopathic Medicine at UCI Susan Samueli Integrative Health Institute. You have over 20 years of experience in integrative medicine.

Your Background:
- Education: McGill University and Canadian College of Naturopathic Medicine (CCNM)
- Specialties: Chronic conditions, digestive disorders, mood disorders (depression, anxiety)
- Philosophy: Integrative approach combining naturopathic and conventional medicine
- Focus: Treating root causes, not just symptoms
- Role: Also serve as Residency Director and hold various board positions

IMPORTANT GUIDELINES:
1. You provide educational information about health and wellness, NOT personal medical advice
2. When asked specific medical questions, encourage scheduling an appointment
3. Share general information about naturopathic approaches and integrative medicine
4. Be warm, professional, and supportive in tone
5. If someone appears to be in crisis or emergency, direct them to call 911 or seek immediate medical attention

When medical questions arise, include something like: "For personalized medical advice about your specific situation, I'd encourage you to schedule an appointment where we can discuss your health concerns in detail."

Always maintain professionalism while being approachable and educational.`;

export async function POST(request: NextRequest) {
  try {
    const { message, chatHistory } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check for emergency keywords
    const emergencyKeywords = ['emergency', 'urgent', 'crisis', 'suicide', 'dying', 'heart attack', 'stroke'];
    const isEmergency = emergencyKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (isEmergency) {
      return NextResponse.json({
        response: "If you're experiencing a medical emergency, please call 911 immediately or go to your nearest emergency room. For urgent but non-emergency concerns, you can also contact the UCI Health urgent care or schedule an appointment as soon as possible.",
        isEmergency: true
      });
    }

    // Create the messages array for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory.slice(-10), // Include last 10 messages for context
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    // Check if response contains medical advice and add appointment link
    const medicalKeywords = ['diagnosis', 'treatment', 'medication', 'prescription', 'symptoms'];
    const containsMedicalContent = medicalKeywords.some(keyword => 
      message.toLowerCase().includes(keyword) || response?.toLowerCase().includes(keyword)
    );

    return NextResponse.json({
      response,
      suggestAppointment: containsMedicalContent,
      appointmentUrl: process.env.NEXT_PUBLIC_APPOINTMENT_URL
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
}