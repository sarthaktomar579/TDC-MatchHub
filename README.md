# TDC MatchHub - Matchmaker Dashboard MVP

TDC MatchHub is an internal dashboard and matchmaking algorithm MVP built for The Date Crew matchmakers to manage customers, view detailed biodata, and find intelligent matches powered by AI.

## Technical Choices
The application is built using **Next.js (App Router)**. This choice allows us to seamlessly integrate both the frontend React components and the backend API routes into a single repository, which is ideal for a fast-paced MVP. For styling, we implemented a custom, robust **Vanilla CSS** design system using CSS variables to ensure maximum flexibility and adherence to the clean, premium, and emotionally aligned aesthetic required by the assignment. The backend relies on Next.js API routes and a static mock JSON database generated via a custom script (`scripts/generateProfiles.js`) to simulate 150 diverse profiles. 

## Matching Logic
The baseline matching algorithm incorporates gender-specific rules as requested:
- **For Male Customers**: The algorithm filters female candidates who are strictly younger, earn an equal or lesser income, are shorter in height, and have compatible views on having children.
- **For Female Customers**: The algorithm uses thoughtful, values-based compatibility filters. It looks for male candidates who are at least 2 years younger or older (age >= customer.age - 2), and strictly matches on lifestyle proxies such as Diet and Relocation preferences.

## AI Integration
We integrated the **OpenAI API (gpt-4o-mini)** to elevate the matchmaking experience. After the baseline logic narrows down the pool to the top 5 candidates, the AI evaluates the JSON profiles of both the customer and the potential match. It outputs a score (1-100), a descriptive label ("High Potential Match"), and a customized 2-sentence explanation of why the match makes sense. Furthermore, the AI generates a personalized, short introduction email that the matchmaker can copy or use directly to introduce the candidate to their client.

## Assumptions Made
1. **Data Scope**: We assumed that the "dummy profiles" required detailed Indian matchmaking fields, so we included fields like Diet, Caste, Religion, Drinking, and Smoking in our data generator to add realism.
2. **AI Fallback**: We assumed the reviewer might not have an OpenAI API key on hand, so we implemented a fallback `generateMockScore` function in the matches API that uses a deterministic algorithm to provide the score and explanation if `process.env.OPENAI_API_KEY` is undefined. 

## Running Locally

1. Clone the repository and install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Generate the mock database of profiles (150 candidates):
   \`\`\`bash
   npm run generate-data
   \`\`\`
   *(Note: You can just run `node scripts/generateProfiles.js` if the script is not in package.json)*

3. Start the Next.js development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Navigate to `http://localhost:3000` and sign in with the mock credentials:
   - **Username**: admin
   - **Password**: password
