import { db } from "../database/database.js";
import OpenAi from "openai";

const openai = new OpenAi({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.API_KEY,
});
let airesponse;
const userdetails = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await db.query(
      "SELECT * FROM personalinfo WHERE user_id=$1",
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User details not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Error fetching user details" });
  }
};
const workoutrecommend = async (req, res) => {
  const {user_id} = req.params
  try {
    const {
      age,
      bmi,
      gender,
      height,
      weight,
      condition,
      location,
      frequency,
      duration,
      goal,
    } = req.body;
    const existing = await db.query("SELECT * FROM workouts WHERE user_id=$1", [
      user_id,
    ]);
    if (existing.rows.length > 0) {
      return res.json({
        success: false,
        message: "Workout already exists",
        plan: existing.rows,
      });
    } else {
      console.log("Generating new workout plan...");

      // 2️⃣ Generate workout using Gemini
      
  const prompt = `
You are a certified personal trainer.

Create a structured 30-day workout plan for a ${age}-year-old ${gender}, ${height} cm, ${weight} kg, BMI ${bmi}.
Training location: ${location}
Frequency: ${frequency} days/week
Session duration: ${duration} minutes
Goal: ${goal}
Medical condition: ${condition}

⚠️ CRITICAL OUTPUT RULES — FOLLOW STRICTLY ⚠️
--------------------------------------------------------
1. OUTPUT MUST BE A SINGLE MARKDOWN TABLE.
2. NO explanations, NO reasoning, NO analysis, NO JSON, NO text before or after the table.
3. DO NOT output any "role", "assistant", "reasoning", or meta fields.
4. ONLY output rows of the table.
5. NO extra commentary, NO surrounding backticks.
6. If unsure, output ONLY the table.

--------------------------------------------------------
TABLE FORMAT (MUST FOLLOW EXACTLY)
| Day | Focus | Exercises |
|---|---|---|

Each Day must include:
- 6 exercises for regular workout days
- 6 light activities for Active Recovery
- "No exercises scheduled" for Rest days

Exercise format must be EXACTLY:
Exercise Name (Sets x Reps — one-sentence description — ~XX kcal — Muscle Groups)

STRICT RULES:
- One sentence per description
- No commas inside the description sentence
- No brackets {}, [], “” or special characters
- Use commas ONLY to separate exercises in the cell
- No line breaks inside an exercise cell
- 30 days total
- Rotate the 7-day cycle:
  Upper Push → Lower Strength → Upper Pull → Core Stability → Full Body → Active Recovery → Rest
- Give vareity of exercises for cycle. 
- No two consecutive days may have the same Focus

No unwanted text should appear outside the table.

**IMPORTANT**

* Output only a markdown table (no explanations or extra text).
* Include exactly 30 rows.
* Each row’s description must be at least 20 words.
* Do not include roles, reasoning, or chain-of-thought.

`;

      try {
        const completion = await openai.chat.completions.create({
          model: "amazon/nova-2-lite-v1:free",
          max_tokens : 6000,
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

    function parseTable(table) {
  const lines = table.split("\n").slice(2); // skip headers

  const output = [];

  for (const line of lines) {
    if (!line.trim().startsWith("|")) continue;

    const cols = line
      .split("|")
      .map(c => c.trim())
      .filter(c => c.length > 0);

    

    const day = Number(cols[0]);
    const focus = cols[1];
    const exercises = cols[2];

    

    output.push({ day, focus, exercises });
  }

  return output;
}


const result = parseTable(airesponse);
      for (let day of result) {
        await db.query(
          "INSERT INTO workouts (user_id, day, focus, exercises) VALUES ($1,$2,$3,$4)",
          [user_id, day.day, day.focus, day.exercises]
        );
      }

      console.log("Workout plan saved:", user_id);
      return res.json({
        success: true,
        message: "Workout plan added successfully",
        plan: airesponse,
      });
    }
  } catch (error) {
    console.error("Error generating workout plan:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to generate plan" });
  }
};

const getallworkouts = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await db.query(
      "select * from workouts where user_id=$1 ORDER BY day::int ASC ",
      [user_id]
    );
    return res.json(result.rows);
  } catch (error) {}
};


const dietrecommend = async (req, res) => {
  const {
    age,
    gender,
    height,
    weight,
    condition,
    location,
    frequency,
    duration,
    goal,
    diet,
    meal,
    allergy,
  } = req.body;
  const {user_id} = req.params
  const already = await db.query(`select * from diet where user_id=$1`, [
    user_id,
  ]);
  if (already.rows.length > 0) {
    return null;
  } else {
    console.log("diet started");
    const prompt = `You are a certified nutritionist.
Create a structured 7-day diet plan for a ${age}-year-old ${gender}, ${height} cm, ${weight} kg located in ${location}.

Workout frequency: ${frequency} days/week
Workout duration: ${duration} minutes
Goal: ${goal}
Medical condition: ${condition}
Diet type: ${diet}
Meal preference: ${meal} (3 meals + 2 snacks/day)
Allergies: ${allergy}

STRICT OUTPUT FORMAT (FOLLOW ALL RULES):
------------------------------------------------------
⚠️ OUTPUT MUST BE A SINGLE MARKDOWN TABLE
⚠️ NO text before or after the table
⚠️ EXACT 7 rows: Monday → Sunday
⚠️ Columns: Day | Meals | Calories Total
⚠️ Meals column must contain ALL 5 meals — each formatted:
Breakfast: Meal Name (Portion — 1-line key benefit — ~___ kcal — Main nutrients),
Snack: Meal Name (...)
Lunch: Meal Name (...)
Snack: Meal Name (...)
Dinner: Meal Name (...)
⚠️ Every meal must include:
- Portion size
- ~Calories
- 1 benefit phrase
⚠️ Keep descriptions short & crisp
⚠️ Indian foods only (based on user location)

STRICT MARKDOWN TABLE FORMATTING:
------------------------------------------------------
| Day | Meals | Total Calories |
| --- | --- | --- |
| Monday | ... | ... |
| Tuesday | ... | ... |
...
------------------------------------------------------

RULES:
✔ Every row MUST follow this exact alignment:
| **Friday** | **Breakfast:** ...
^^ SPACE before and after every |
✔ Day column MUST NOT contain any other text
✔ Give proper breakfast, lunch,dinner
✔ No bold markers near the pipe divider ( | )
✔ EXACT format for every row:
| Monday | Breakfast(...), Snack(...), Lunch(...), Snack(...), Dinner(...) | 2800 cal |

`;
    try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          max_tokens : 2000,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });
        airesponse = completion.choices[0].message.content;
        console.log(airesponse)
      } catch (error) {
        console.log(error);
        
      }
    const rows = airesponse.split("\n").slice(2); 
const result = [];

rows.forEach((line) => {
  if (!line.trim().startsWith("|")) return;

  const cols = line.split("|").map((c) => c.trim());

  const day = cols[1];              // Monday / Tuesday / etc.
  const meals = cols[2];            // entire meals string
  const totalcalories = cols[3];    // "~2100 kcal"
 
  const breakfast = meals.split("Breakfast: ")[1]?.split(", Snack:")[0];
  const snack1 = meals.split("Snack: ")[1]?.split(", Lunch: ")[0];
  const lunch = meals.split("Lunch: ")[1]?.split(", Snack: ")[0];
  const snack2 = meals.split("Snack: ")[2]?.split(", Dinner: ")[0];
  const dinner = meals.split("Dinner: ")[1];

  result.push({
    day,
    breakfast: breakfast?.trim(),
    snack1: snack1?.trim(),
    lunch: lunch?.trim(),
    snack2: snack2?.trim(),
    dinner: dinner?.trim(),
    totalcalories: totalcalories?.replace("kcal", "cal"),
  });
});

    for (let day of result) {
      await db.query(
        "INSERT INTO diet (user_id, dayname, breakfast,snack1,lunch,snack2,dinner, totalcalories) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
        [
          user_id,
          day.day,
          day.breakfast,
          day.snack1,
          day.lunch,
          day.snack2,
          day.dinner,
          day.totalcalories,
        ]
      );
    }

    console.log("diet plan saved:", user_id);
    return res.json({
      success: true,
      message: "diet plan added successfully",
      plan: result,
      airesponse:airesponse
    });
  }
};

const getdiet = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await db.query(
      `SELECT *
FROM diet
WHERE user_id = $1
ORDER BY CASE dayname
    WHEN 'Monday' THEN 1
    WHEN 'Tuesday' THEN 2
    WHEN 'Wednesday' THEN 3
    WHEN 'Thursday' THEN 4
    WHEN 'Friday' THEN 5
    WHEN 'Saturday' THEN 6
    WHEN 'Sunday' THEN 7
END;`,
      [user_id]
    );
    return res.json(result.rows);
  } catch (error) {}
};

const workoutdone = async (req, res) => {
  const { user_id } = req.params;
  const { day, exercise, isdone, name } = req.body;
  const alreadyadded = await db.query(
    `select * from workoutdone where day=$1 and exercise=$2 and user_id=$3`,
    [day, exercise, user_id]
  );
  if (alreadyadded.rows.length > 0) {
    await db.query(
      `UPDATE workoutdone 
         SET isdone=$1 
         WHERE user_id=$2 AND day=$3 AND exercise=$4`,
      [isdone, user_id, day, exercise]
    );
    res.status(200).json({ success: "success" });
  } else {
    await db.query(
      `INSERT INTO workoutdone (user_id, day, exercise, isdone,exercisename)
     VALUES ($1, $2, $3, $4, $5) `,
      [user_id, day, exercise, isdone,name]
    );

    res.status(200).json({ success: "success" });
  }
};

const getchangedworkout = async (req, res) => {
  const { user_id } = req.params;
  const { day } = req.query;
  const workoutdone = await db.query(
    `select * from workoutdone where user_id=$1 and day=$2 order by exercise asc `,
    [user_id, day]
  );
  if (workoutdone.rows.length === 0) {
    return null;
  } else {
    return res.status(200).json(workoutdone.rows);
  }
};

console.log("resposne",airesponse);

export default {
  workoutrecommend,
  userdetails,
  getallworkouts,
  dietrecommend,
  getdiet,
  workoutdone,
  getchangedworkout,
};