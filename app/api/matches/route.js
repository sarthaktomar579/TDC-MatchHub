import { NextResponse } from 'next/server';
import { getCustomerById, getAllProfiles } from '@/lib/dataAccess';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export async function POST(request) {
  try {
    const { customerId } = await request.json();
    const customer = getCustomerById(customerId);
    
    if (!customer) {
      return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 });
    }

    const allProfiles = getAllProfiles();
    const oppositeGender = customer.gender === 'Male' ? 'Female' : 'Male';
    let potentialMatches = allProfiles.filter(p => p.gender === oppositeGender);

    // Apply baseline filtering
    if (customer.gender === 'Male') {
      // For male customers: women who are younger, earn less, shorter, and have matching views on children
      const customerHeightInches = parseHeight(customer.height);
      potentialMatches = potentialMatches.filter(p => {
        const pHeight = parseHeight(p.height);
        const matchesKids = customer.wantKids === p.wantKids || customer.wantKids === 'Maybe' || p.wantKids === 'Maybe';
        return p.age < customer.age && p.income <= customer.income && pHeight < customerHeightInches && matchesKids;
      });
    } else {
      // For female customers: compatibility on profession, values (diet/religion), relocation preferences
      potentialMatches = potentialMatches.filter(p => {
        const matchesDiet = customer.diet === p.diet || p.diet === 'Vegetarian'; // Simple proxy for values
        const matchesRelocation = customer.openToRelocate === p.openToRelocate || customer.openToRelocate === 'Maybe' || p.openToRelocate === 'Maybe';
        return p.age >= customer.age - 2 && matchesDiet && matchesRelocation;
      });
    }

    // Take top 3 candidates to process to avoid Gemini free tier rate limits (15 RPM)
    potentialMatches = potentialMatches.slice(0, 3);

    // Score and add explanations using AI
    const enrichedMatches = await Promise.all(potentialMatches.map(async (match) => {
      if (genAI) {
        try {
          const prompt = `
            Analyze compatibility between these two individuals for Indian matchmaking.
            Customer (Seeking match): ${JSON.stringify(customer)}
            Potential Match: ${JSON.stringify(match)}
            
            Provide a JSON response with exactly these fields:
            {
              "score": <number 1-100>,
              "label": <"High Potential Match", "Good Match", or "Moderate Match">,
              "explanation": <Short 2 sentence explanation of why they are a good fit based on the data>,
              "introEmail": <A short personalized intro email (1 paragraph) that the matchmaker could send to the Customer about this Match>
            }
          `;
          
          const model = genAI.getGenerativeModel({ 
            model: "gemini-3.5-flash",
            generationConfig: { responseMimeType: "application/json" }
          });
          
          const result = await model.generateContent(prompt);
          const aiResult = JSON.parse(result.response.text());
          return { ...match, aiMatchData: aiResult };
        } catch (error) {
          console.error("Gemini Error:", error.message);
          // Gracefully fallback to mock score without breaking the UI
          return { ...match, aiMatchData: generateMockScore(customer, match) };
        }
      } else {
        // Fallback if no Gemini Key
        return { ...match, aiMatchData: generateMockScore(customer, match) };
      }
    }));

    return NextResponse.json({ success: true, matches: enrichedMatches });
  } catch (error) {
    console.error("Match API Error:", error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// Helper to convert 5'10" to inches
function parseHeight(heightStr) {
  const parts = heightStr.split("'");
  const feet = parseInt(parts[0]);
  const inches = parts[1] ? parseInt(parts[1].replace('"', '')) : 0;
  return (feet * 12) + inches;
}

// Fallback scoring logic when OpenAI is not configured
function generateMockScore(customer, match) {
  let score = 75; // base score
  if (customer.religion === match.religion) score += 10;
  if (customer.diet === match.diet) score += 10;
  if (customer.wantKids === match.wantKids) score += 5;
  
  const label = score > 90 ? "High Potential Match" : score > 80 ? "Good Match" : "Moderate Match";
  const explanation = `Based on our algorithm, ${match.firstName} is a ${label.toLowerCase()} because you share similar values regarding ${customer.wantKids === match.wantKids ? 'family planning' : 'lifestyle'}.`;
  const introEmail = `Hi ${customer.firstName},\n\nI'd like to introduce you to ${match.firstName}. They work as a ${match.designation} at ${match.currentCompany} and share your background. I think you two would really hit it off! Let me know if you'd like to connect.\n\nBest,\nYour Matchmaker`;

  return { score, label, explanation, introEmail };
}
