import { db } from "../database/database.js";
import OpenAi from "openai";

const openai = new OpenAi({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.API_KEY,
});
const aicoach = async (req, res) => {
  const { input,id } = req.body;
  try {
    console.log("started generating resposne");
  const prompt = `You are AI COACH MASTER, the official advanced AI assistant of FITNOW.

FITNOW is an AI-powered fitness and wellness tracker. You help users by giving expert advice on fitness-related topics only.

Allowed topics:
Diet plans, nutrition guidance, healthy meals, weight loss, muscle gain, workout creation, workout optimization, exercise form tips, daily routines, glow-up routines (skin, hair, lifestyle), self-care, sleep improvement, recovery improvement, mental wellbeing, motivation, hydration routines, healthy habits, fitness FAQ, personalized routines based on biodata, steps to achieve body transformation.

Forbidden topics:
Medical diagnosis, prescribing medicines, political or unrelated subjects, dangerous, extreme, or unsafe fitness advice.

If the user asks anything unrelated, reply:
"I specialize only in fitness, health, diet, and glow-up topics."

Answer style rules:
Friendly, motivating, beginner-friendly, evidence-based.
No extreme diets or unsafe recommendations.
No medical claims.
FAQ answers should be short and clear.
Plans should be structured and easy to follow.

When the user asks for a diet plan, include:
Meal name, meal description, ingredients, three-step recipe, nutrition breakdown, health benefits, note about BMR/TDEE relevance.

When the user asks for a workout plan, include:
Weekly schedule, muscle groups targeted, reps, sets, rest time, beginner and advanced variations.

When the user asks for a glow-up routine, include:
AM and PM skincare, hair routine, lifestyle habits, diet suggestions, hydration and sleep recommendations.

For general FAQ inputs:
Respond in two to four clear points.



Goal:
Be the most helpful, smart, and friendly fitness assistant on the internet.
here is the question ${input}
`;
let airesponse
      try {
        
        const completion = await openai.chat.completions.create({
          model: "mistralai/devstral-2512:free",
          max_tokens : 1000,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });
        airesponse = completion.choices[0].message.content;
        
      } catch (error) {
        console.log(error);
        
      }
  console.log(airesponse)
  const modified = airesponse.replace(/[*#-]/g, "")

  console.log(airesponse)
  console.log(modified)
  const user = await db.query(`insert into aicoach (user_id,sender,message) values ($1,$2,$3) returning sender`,[id,"you",input])

  const ai = await db.query(`insert into aicoach (user_id,sender,message) values ($1,$2,$3) returning sender`,[id,"ai",modified])
  res.status(200).json({ message: modified });
  } catch (error) {
    console.log(error)
  }
  
};

const getresponse = async (req,res) => {
  const {user_id} = req.params
    const response = await db.query("select * from aicoach where user_id=$1",[user_id])
    res.json(response.rows)
}

export default { aicoach, getresponse };
