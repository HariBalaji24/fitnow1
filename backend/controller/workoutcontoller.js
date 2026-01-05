import { db } from "../database/database.js";
import OpenAi from "openai";

const openai = new OpenAi({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.API_KEY,
});

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
  const { user_id } = req.params;
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
      let airesponse;
      try {
        const completion = await openai.chat.completions.create({
          model: "mistralai/devstral-2512:free",
          max_tokens: 6000,
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
      console.log("aireponse : ", airesponse);
      function parseTable(table) {
        console.log(table);
        const lines = table.split("\n").slice(2);

        const output = [];

        for (const line of lines) {
          if (!line.trim().startsWith("|")) continue;

          const cols = line
            .split("|")
            .map((c) => c.trim())
            .filter((c) => c.length > 0);

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
  try {
    const { user_id } = req.params;
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

    // ✅ BASIC VALIDATION
    if (!age || !gender || !height || !weight || !goal) {
      return res.status(400).json({
        success: false,
        message: "Incomplete diet details",
      });
    }

    // ✅ CHECK IF DIET ALREADY EXISTS
    const already = await db.query("SELECT 1 FROM diet WHERE user_id=$1", [
      user_id,
    ]);

    if (already.rows.length > 0) {
      return res.json({
        success: false,
        message: "Diet already exists",
      });
    }

    console.log("diet started");

    // ✅ PROMPT
    const prompt = `You are a certified nutritionist.
Create a structured 7-day diet plan for a ${age}-year-old ${gender}, ${height} cm, ${weight} kg located in ${location}.

Workout frequency: ${frequency} days/week
Workout duration: ${duration} minutes
Goal: ${goal}
Medical condition: ${condition}
Diet type: ${diet}
Meal preference: ${meal} (3 meals + 2 snacks/day)
Allergies: ${allergy}

STRICT OUTPUT FORMAT:
| Day | Meals | Total Calories |
| --- | --- | --- |
| Monday | Breakfast(...), Snack(...), Lunch(...), Snack(...), Dinner(...) | 2800 cal |
(7 rows only)
`;

    // ✅ AI CALL
    let airesponse;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      });

      airesponse = completion.choices?.[0]?.message?.content;
    } catch (err) {
      console.error(" error:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    // ✅ VALIDATE AI RESPONSE
    if (!airesponse || typeof airesponse !== "string") {
      return res.status(500).json({
        success: false,
        message: "Empty AI response",
      });
    }

    const rows = airesponse
      .split("\n")
      .filter((line) => line.trim().startsWith("|") && !line.includes("---"));

    const result = [];

    for (const row of rows) {
      const cols = row
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      if (cols.length !== 3) continue;

      const day = cols[0];
      const mealsText = cols[1];
      const totalcalories = cols[2].replace("cal", "").trim();

      // Regex extraction
      const mealMatches = mealsText.match(
        /Breakfast\s*\((.*?)\),\s*Snack\s*\((.*?)\),\s*Lunch\s*\((.*?)\),\s*Snack\s*\((.*?)\),\s*Dinner\s*\((.*?)\)/i
      );

      if (!mealMatches) continue;

      const [, breakfast, snack1, lunch, snack2, dinner] = mealMatches;

      result.push({
        day,
        breakfast,
        snack1,
        lunch,
        snack2,
        dinner,
        totalcalories,
      });
    }

    if (result.length !== 7) {
      return res.status(500).json({
        success: false,
        message: "Invalid diet format generated",
      });
    }

    for (const day of result) {
      await db.query(
        `INSERT INTO diet 
         (user_id, dayname, breakfast, snack1, lunch, snack2, dinner, totalcalories)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
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
      message: "Diet plan added successfully",
      plan: airesponse,
    });
  } catch (error) {
    console.error("Diet controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate diet plan",
    });
  }
};

const getdiet = async (req, res) => {
  try {
    console.log("diet plan api called")
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
  } catch (error) {
    console.log(error)
  }
};

const workoutdone = async (req, res) => {
  const { user_id } = req.params;
  let { day, exercise, isdone, name } = req.body;
  console.log(req.body)
  try {
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
  } catch (error) {
    console.error("Workoutdone ERROR:", error.message);
    res.status(500).json({ error: error.message })
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

const sample= async (req,res)=> {
  const {user_id} = req.body
  res.json({userid:user_id})
}

export default {
  workoutrecommend,
  userdetails,
  getallworkouts,
  dietrecommend,
  getdiet,
  workoutdone,
  getchangedworkout,
  sample
};
