import { createServerFn } from "@tanstack/react-start";
import { ObjectId } from "mongodb";
import { getNotesCollection } from "../lib/mongodb";
import {
  createNoteSchema,
  updateNoteSchema,
  deleteNoteSchema,
  documentToNote,
  type Note,
  type NoteDocument,
} from "../lib/types";

export const getNotes = createServerFn({ method: "GET" }).handler(
  async (): Promise<Note[]> => {
    try {
      const collection = await getNotesCollection();

      // Query database with sort
      const docs = await collection.find({}).sort({ updatedAt: -1 }).toArray();

      // Convert MongoDB documents to client-friendly format
      return docs.map(documentToNote);
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw new Error("Failed to fetch notes");
    }
  }
);

export const createNote = createServerFn({ method: "POST" })
  .inputValidator(createNoteSchema) // ← Automatic validation!
  .handler(async ({ data }) => {
    try {
      const collection = await getNotesCollection();
      const now = new Date();

      // Create note document
      const newNote: NoteDocument = {
        title: data.title,
        content: data.content,
        createdAt: now,
        updatedAt: now,
      };

      // Insert into database
      const result = await collection.insertOne(newNote as any);

      // Fetch the created note
      const created = await collection.findOne({ _id: result.insertedId });

      if (!created) {
        throw new Error("Note created but could not be retrieved");
      }

      return documentToNote(created);
    } catch (error) {
      console.error("Error creating note:", error);
      throw new Error("Failed to create note");
    }
  });

export const updateNote = createServerFn({ method: "POST" })
  .inputValidator(updateNoteSchema)
  .handler(async ({ data }) => {
    try {
      const collection = await getNotesCollection();

      // Build update object (only include provided fields)
      const updateFields: Partial<Omit<NoteDocument, "_id">> = {
        updatedAt: new Date(),
      };

      if (data.title !== undefined) updateFields.title = data.title;
      if (data.content !== undefined) updateFields.content = data.content;

      // Update in database
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(data.id) },
        { $set: updateFields },
        { returnDocument: "after" }
      );

      if (!result) {
        throw new Error("Note not found");
      }

      return documentToNote(result);
    } catch (error) {
      console.error("Error updating note:", error);
      if (error instanceof Error && error.message === "Note not found") {
        throw error;
      }
      throw new Error("Failed to update note");
    }
  });

export const deleteNote = createServerFn({ method: "POST" })
  .inputValidator(deleteNoteSchema)
  .handler(async ({ data }) => {
    try {
      const collection = await getNotesCollection();

      const result = await collection.deleteOne({
        _id: new ObjectId(data.id),
      });

      if (result.deletedCount === 0) {
        throw new Error("Note not found");
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting note:", error);
      if (error instanceof Error && error.message === "Note not found") {
        throw error;
      }
      throw new Error("Failed to delete note");
    }
  });
