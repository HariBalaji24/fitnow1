import { db } from "../database/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import { oauth2client } from "../utils/googleconfig.js";

const secretkey = process.env.secretkey;

export const signin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await db.query(
      "SELECT * FROM userdetails WHERE email=$1",
      [email]
    );

    if (exists.rows.length > 0) {
      return res.json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO userdetails (name,email,password) 
       VALUES ($1,$2,$3) RETURNING user_id`,
      [name, email, hashed]
    );

    const userid = result.rows[0].user_id;

    const token = jwt.sign({ id: userid }, secretkey, {
      expiresIn: "7d",
    });

    const user_id = result.rows[0].user_id

    return res.json({
      success: true,
      message: "Sign Up Successful",
      signin: true,
      userid:user_id,
      token,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM userdetails WHERE email=$1", [
    email,
  ]);

  if (result.rows.length === 0) {
    return res.json({ message: "Email not registered" });
  }

  const user = result.rows[0];

  if (!user.password) {
    return res.json({ message: "This account uses Google login" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.json({ message: "Incorrect Password" });
  }

  const token = jwt.sign({ id: user.user_id }, secretkey, {
    expiresIn: "7d",
  });

  return res.status(200).json({
    success: true,
    message: "Login Successful",
    signin: false,
    userid: user.user_id,
    token,
  });
  } catch (error) {
    return res.json({
    success: error.message
  });
  }

  
};

export const googlelogin = async (req, res) => {
  try {
    const { code } = req.query;

    const { tokens } = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const { email, name } = userRes.data;

    const result = await db.query(
      "SELECT * FROM userdetails WHERE email=$1",
      [email]
    );

    let user;

    if (result.rows.length === 0) {
      const insertRes = await db.query(
        `INSERT INTO userdetails (name,email,password) VALUES ($1,$2,$3) RETURNING *`,
        [name, email, null]
      );
      user = insertRes.rows[0];
    } else {
      user = result.rows[0];
    }

    const token = jwt.sign(
      { id: user.user_id, email },
      secretkey,
      { expiresIn: "7d" }
    );

    return res.json({
      logged: true,
      message: "Google Login Successful",
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Google login failed" });
  }
};



const getclients = async (req, res) => {
  const result = await db.query("SELECT * FROM userdetails");
  res.status(200).json(result.rows);
};

const adddetails = async (req, res) => {
  const {
    userid,
    firstname,
    secondname,
    age,
    gender,
    height,
    weight,
    bmi,
    condition,
    location,
    frequency,
    duration,
    goal,
    diet,
    meal,
    allergy,
  } = req.body;
  const newbmi=Number(bmi)
  const result = await db.query(
    "insert into personalinfo (user_id,firstname,secondname,age,gender,height,weight,bmi,condition,location,frequency,duration,goal,diet,meal,allergy) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)",
    [
      userid,
      firstname,
      secondname,
      age,
      gender,
      height,
      weight,
      newbmi,
      condition,
      location,
      frequency,
      duration,
      goal,
      diet,
      meal,
      allergy,
    ]
  );
  res.status(200).json({ message: "details saved", detailsfilled:true });
};


export const getid = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secretkey);
    const result = await db.query(
      "SELECT * FROM userdetails WHERE user_id=$1",
      [decoded.id]
    );
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid Token", error: err.message });
  }
};

export const updateuser = async (req,res) => {
    try {
      const data = req.body
      const {user_id} = req.params
      const user = await db.query('select * from personalinfo where user_id=$1',[user_id])
      if(user.rows.length===0){
        return res.json({message:"User not found"})
      }
      
        const updatedquery = `
      UPDATE personalinfo 
      SET firstname=$1, secondname=$2, age=$3, gender=$4,
          height=$5, weight=$6, bmi=$7, condition=$8,
          location=$9, frequency=$10, duration=$11,
          goal=$12, diet=$13, meal=$14, allergy=$15
      WHERE user_id=$16
      RETURNING *;
    `;
    const values = [
      data.firstname,
      data.secondname,
      data.age,
      data.gender,
      data.height,
      data.weight,
      data.bmi,
      data.condition,
      data.location,
      data.frequency,
      data.duration,
      data.goal,
      data.diet,
      data.meal,
      data.allergy,
      user_id
    ];

    const updatedUser = await db.query(updatedquery, values);
console.log(updatedUser)
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser.rows[0],
    });
      
    } catch (error) {
      res.json(error)
    }
}

export default {
  signin,
  login,
  getclients,
  adddetails,
  googlelogin,
  getid,
  updateuser
};
