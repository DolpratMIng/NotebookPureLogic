import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "../generated/prisma/client.ts";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { ChatOpenAI } from "@langchain/openai";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const app = express();
const port = 8000;
// 1. Create a PG pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Create the adapter
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);
app.use(express.json());

app.get("/health", (req, res) => {
  console.log("API Key loaded:", process.env.OPENROUTER_API_KEY);

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      "Missing API Key! Check your .env file or environment configuration.",
    );
  }
  res.send("working fine");
});
/*CRUD for note */
//get /notes
//JWT use it
app.get("/notes", authMiddleware, async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error("GET /notes error:", error);
    res.status(500).json({
      error: "Failed to fetch notes",
    });
  }
});

//get notes/:id
app.get("/notes/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    //check that id is number
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const note = await prisma.note.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!note) {
      return res.status(404).json({
        error: "Note not found",
      });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch notes",
    });
  }
});

//post for create note
app.post("/notes", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    // check the title and content
    if (!title || !content) {
      return res.status(400).json({
        error: "Title and content are required",
      });
    }

    const note = await prisma.note.create({
      data: {
        title: title,
        content: content,
        userId: req.user.userId,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      error: "Failed to fetch notes",
    });
  }
});

//put for update note
app.put("/notes", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.body.id);
    // title and content object
    const { title, content } = req.body;

    // validate ID
    if (isNaN(id)) {
      return res.status(400).json({ error: "invalid ID format" });
    }

    if (title === undefined && content === undefined) {
      return res.status(400).json({
        error: "At least title or content must be provided",
      });
    }

    const updateNote = await prisma.note.updateMany({
      where: { id: id, userId: req.user.userId },
      data: {
        title: title,
        content: content,
      },
    });

    if (updateNote.count === 0) {
      return res.status(403).json({ error: "Not allowed" });
    }

    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      error: "failed to update note",
    });
  }
});

//delete for delete note
app.delete("/notes", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.body.id);

    //id validation
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // prisma delete
    const deleted = await prisma.note.deleteMany({
      where: {
        id: id,
        userId: req.user.userId,
      },
    });

    if (deleted.count === 0) {
      return res.status(403).json({ error: "Not allowed" });
    }

    res.status(200).json({
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      error: "Failed to delete",
    });
  }
});

app.post("/chat", authMiddleware, async (req, res) => {
  const { input } = req.body;

  try {
    // 1. Fetch the user's notes
    const notes = await prisma.note.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "asc" },
    });

    // 2. Build notes context string
    const notesContext = notes
      .map(
        (note, index) =>
          `Note ${index + 1}:\nTitle: ${note.title}\nContent: ${note.content}`,
      )
      .join("\n\n");

    // 3. Build system prompt
    const systemPrompt = `You are a helpful note-taking assistant. The user has the following notes saved:\n\n${notesContext}\n\nYou can help the user with:\n- Retrieving note content based on the title\n- Summarizing a note's content\n- Listing all notes\n\nAnswer based on the notes above. If the user asks about something not in their notes, let them know. Keep your answers concise.`;

    // 4. Send to LLM with system prompt
    const model = new ChatOpenAI({
      model: "z-ai/glm-4.5-air:free",
      openAIApiKey: process.env.OPENROUTER_API_KEY,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
      },
    });

    const response = await model.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: input },
    ]);

    res.json({ result: response.content });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

//Register route
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    // Prisma unique constraint error (duplicate email)
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email already exists" });
    }

    console.error("Register error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//for login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // JWT
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token });
});

//Middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid auth format" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ message: "Invalid auth format" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
