import { a as createServerRpc, c as createServerFn } from "../server.js";
import { ObjectId } from "mongodb";
import { g as getNotesCollection, d as documentToNote, c as createNoteSchema, u as updateNoteSchema, a as deleteNoteSchema } from "./types-CZ_5aSfc.js";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core";
import "node:async_hooks";
import "@tanstack/router-core/ssr/server";
import "h3-v2";
import "tiny-invariant";
import "seroval";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "@tanstack/react-router";
import "zod";
const getNotes_createServerFn_handler = createServerRpc("f82fe0a8823169db464e13d5360ffb9c7ccf24363fad78ef08fde052634583c2", (opts, signal) => {
  return getNotes.__executeServer(opts, signal);
});
const getNotes = createServerFn({
  method: "GET"
}).handler(getNotes_createServerFn_handler, async () => {
  try {
    const collection = await getNotesCollection();
    const docs = await collection.find({}).sort({
      updatedAt: -1
    }).toArray();
    return docs.map(documentToNote);
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw new Error("Failed to fetch notes");
  }
});
const createNote_createServerFn_handler = createServerRpc("adf580c99fe4703be66856341616b124bacfeb6f1f282e1c6e4d7c60686bf5c1", (opts, signal) => {
  return createNote.__executeServer(opts, signal);
});
const createNote = createServerFn({
  method: "POST"
}).inputValidator(createNoteSchema).handler(createNote_createServerFn_handler, async ({
  data
}) => {
  try {
    const collection = await getNotesCollection();
    const now = /* @__PURE__ */ new Date();
    const newNote = {
      title: data.title,
      content: data.content,
      createdAt: now,
      updatedAt: now
    };
    const result = await collection.insertOne(newNote);
    const created = await collection.findOne({
      _id: result.insertedId
    });
    if (!created) {
      throw new Error("Note created but could not be retrieved");
    }
    return documentToNote(created);
  } catch (error) {
    console.error("Error creating note:", error);
    throw new Error("Failed to create note");
  }
});
const updateNote_createServerFn_handler = createServerRpc("8cd0049a2c6d3795ac04002ca8d0fdd5a5a70a8980aa24b7c51f9d36b6d1ff87", (opts, signal) => {
  return updateNote.__executeServer(opts, signal);
});
const updateNote = createServerFn({
  method: "POST"
}).inputValidator(updateNoteSchema).handler(updateNote_createServerFn_handler, async ({
  data
}) => {
  try {
    const collection = await getNotesCollection();
    const updateFields = {
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (data.title !== void 0) updateFields.title = data.title;
    if (data.content !== void 0) updateFields.content = data.content;
    const result = await collection.findOneAndUpdate({
      _id: new ObjectId(data.id)
    }, {
      $set: updateFields
    }, {
      returnDocument: "after"
    });
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
const deleteNote_createServerFn_handler = createServerRpc("2f477c26e719e33c03cb4057a2c6bd9e41c72ef1f2554aa8cd40762c5bc1a94d", (opts, signal) => {
  return deleteNote.__executeServer(opts, signal);
});
const deleteNote = createServerFn({
  method: "POST"
}).inputValidator(deleteNoteSchema).handler(deleteNote_createServerFn_handler, async ({
  data
}) => {
  try {
    const collection = await getNotesCollection();
    const result = await collection.deleteOne({
      _id: new ObjectId(data.id)
    });
    if (result.deletedCount === 0) {
      throw new Error("Note not found");
    }
    return {
      success: true
    };
  } catch (error) {
    console.error("Error deleting note:", error);
    if (error instanceof Error && error.message === "Note not found") {
      throw error;
    }
    throw new Error("Failed to delete note");
  }
});
export {
  createNote_createServerFn_handler,
  deleteNote_createServerFn_handler,
  getNotes_createServerFn_handler,
  updateNote_createServerFn_handler
};
