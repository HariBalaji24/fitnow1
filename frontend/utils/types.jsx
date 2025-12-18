import { z } from "zod";

/* 🧍 STEP 1: Personal Info */
export const personalInfoSchema = z.object({
  firstname: z.string().min(1, "This field is required"),
  lastname: z.string().min(1, "This field is required"),
  age: z.coerce.number({ invalid_type_error: "This field is required" }),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "This field is required",
  }),
  activityLevel: z.enum(
    [
      "Sedentary (desk job, little activity)",
      "Lightly Active (walks occasionally)",
      "Moderately Active (workouts 3–4x/week)",
      "Very Active (daily workouts, physical job)",
    ],
    { required_error: "This field is required" }
  ),
  fitnessLevel: z.enum(["Beginner", "Intermediate", "Advanced"], {
    required_error: "This field is required",
  }),
});

/* 📏 STEP 2: Body Stats */
export const bodyStatsSchema = z.object({
  height: z.coerce.number({ invalid_type_error: "This field is required" }),
  weight: z.coerce.number({ invalid_type_error: "This field is required" }),
  bmi: z.coerce.number({ invalid_type_error: "This field is required" }),
  medicalCondition: z
    .array(
      z.enum(["Diabetes", "PCOS", "Thyroid", "Heart Disease", "None"], {
        required_error: "This field is required",
      })
    )
    .optional(),
});

/* 🏋️ STEP 3: Workout Preferences */
export const workoutSchema = z.object({
  workoutLocation: z.enum(["Gym", "Home", "Both"], {
    required_error: "This field is required",
  }),
  availableEquipment: z
    .array(
      z.enum(
        ["Bodyweight", "Dumbbells", "Resistance Bands", "Bench", "Pull-up Bar"],
        { required_error: "This field is required" }
      )
    )
    .nonempty("This field is required"),
  frequency: z.coerce.number({ invalid_type_error: "This field is required" }),
  duration: z.coerce.number({ invalid_type_error: "This field is required" }),
});

/* 🍎 STEP 4: Diet Preferences */
export const dietSchema = z.object({
  goal: z.enum(
    ["Fat Loss", "Muscle Gain", "Maintain Weight", "Strength & Endurance"],
    { required_error: "This field is required" }
  ),
  dietPreference: z.enum(
    ["Vegetarian", "Non-Vegetarian", "Vegan", "Eggetarian"],
    { required_error: "This field is required" }
  ),
  mealType: z.enum(["Indian", "Continental", "Mixed"], {
    required_error: "This field is required",
  }),
  allergies: z
    .array(
      z.enum(["Lactose Intolerant", "Gluten-Free", "Nut Allergy", "None"], {
        required_error: "This field is required",
      })
    )
    .optional(),
  mealsPerDay: z.coerce.number({ invalid_type_error: "This field is required" }),
  hydrationTarget: z
    .coerce.number({ invalid_type_error: "This field is required" })
    .optional(),
});

/* 🧩 Combined Schema */
export const allStepsSchema = z.object({
  personalInfo: personalInfoSchema,
  bodyStats: bodyStatsSchema,
  workout: workoutSchema,
  diet: dietSchema,
});
