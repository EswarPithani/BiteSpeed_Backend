import express from "express";
import cors from "cors";
import identifyRoute from "./routes/identify.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/identify", identifyRoute);


app.get("/", (req, res) => {
  res.send(`
    <div style="
      font-family: Arial, sans-serif;
      padding: 40px;
      text-align: center;
      background: #f5f5f5;
    ">
      <h1 style="color:#4F46E5;"> BiteSpeed Backend Is Live! 🚀</h1>
      <p style="font-size:18px;">
        Give me one chance... I promise I'll reconcile identities better than your ex reconciled with their feelings. ❤️🔥
      </p>
      <p style="font-size:16px; margin-top:20px; color:#555;">
        (Also, professionally speaking: the API is running smoothly. Try POST /identify 👨‍💻)
      </p>
    </div>
  `);
});

export default app;
