import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "../generated/prisma/client.ts";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
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

app.get("/heath", (req, res) => {
  res.send("working fine");
});
/*CRUD for note */
//get /notes
app.get("/notes", async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
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
app.get("/notes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    //check that id is number
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return res.status(400).json({
        error: "Note not found",
      });
    }

    res.status(200).json({
      note,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch notes",
    });
  }
});

//post for create note
app.post("/notes", async (req, res) => {
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
app.put("/notes", async (req, res) => {
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

    const updateNote = await prisma.note.update({
      where: { id: id },
      data: {
        title: title,
        content: content,
      },
    });

    res.status(200).json(updateNote);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      error: "failed to update note",
    });
  }
});

//delete for delete note
app.delete("/notes", async (req, res) => {
  try {
    const id = Number(req.body.id);

    //id validation
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // prisma delete
    await prisma.note.delete({
      where: {
        id: id,
      },
    });

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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
