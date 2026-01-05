import { db } from "../database/database.js";

const workoutsdoneonday = async (req, res) => {
  const { user_id } = req.params;
  const { date } = req.query; // expected format: YYYY-MM-DD
  console.log(req.query)
  try {
    // 1️⃣ Get workout creation date (IST)
    const response = await db.query(
      `SELECT updatedat
       FROM workoutdone
       WHERE user_id = $1 and isdone='true'`,
      [user_id]
    );

    if (response.rows.length === 0) {
      return res.json({ message: "Workout not found" });
    }

    const createdDate = response.rows[0].updated;
    
    const result = await db.query(
      `
      SELECT
  (to_char(updatedat AT TIME ZONE 'Asia/Kolkata')::date, 'YYYY-MM-DD') AS workout_date,
  COUNT(*)::int AS total_workouts
FROM workoutdone
WHERE user_id = $1
  AND updatedat::date BETWEEN $2 AND $3
GROUP BY workout_date
ORDER BY workout_date;

      `,
      [user_id, createdDate, date]
    );

    if (result.rows.length === 0) {
      return res.json({ message: "No workouts are done" });
    }

    res.json({
      from: createdDate,
      to: date,
      length: result.rows.length,
      exercises: result.rows,

    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export default { workoutsdoneonday };
