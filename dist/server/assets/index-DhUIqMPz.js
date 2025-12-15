import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { R as Route, c as createNote, u as updateNote, d as deleteNote, g as getNotes } from "./router-AH-gXfXx.js";
import "@tanstack/react-router-devtools";
import "../server.js";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core";
import "node:async_hooks";
import "@tanstack/router-core/ssr/server";
import "h3-v2";
import "tiny-invariant";
import "seroval";
import "@tanstack/react-router/ssr/server";
import "mongodb";
import "./types-CZ_5aSfc.js";
import "zod";
function Home() {
  useRouter();
  const {
    notes: initialNotes
  } = Route.useLoaderData();
  const [notes, setNotes] = useState(initialNotes);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const refreshNotes = async () => {
    const updated = await getNotes();
    setNotes(updated);
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsCreating(true);
    try {
      await createNote({
        data: {
          title: title.trim(),
          content: content.trim()
        }
      });
      setTitle("");
      setContent("");
      await refreshNotes();
    } catch (error) {
      console.error("Failed to create note:", error);
      alert("Failed to create note");
    } finally {
      setIsCreating(false);
    }
  };
  const handleEdit = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };
  const handleUpdate = async (id) => {
    try {
      await updateNote({
        data: {
          id,
          title: editTitle.trim(),
          content: editContent.trim()
        }
      });
      setEditingId(null);
      await refreshNotes();
    } catch (error) {
      console.error("Failed to update note:", error);
      alert("Failed to update note");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteNote({
        data: {
          id
        }
      });
      setDeleteConfirmId(null);
      await refreshNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note");
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 6e4);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-7xl px-4 py-8", children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-gray-900 dark:text-white mb-2", children: "📝 Notes App" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Built with TanStack Start + MongoDB" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-8 max-w-2xl mx-auto", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleCreate, className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-900 dark:text-white", children: "Create New Note" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Title", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white", maxLength: 200 }),
        /* @__PURE__ */ jsx("textarea", { placeholder: "Content", value: content, onChange: (e) => setContent(e.target.value), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white min-h-[100px]", maxLength: 1e4 }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: !title.trim() || isCreating, className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: isCreating ? "Creating..." : "Create Note" })
      ] })
    ] }) }),
    notes.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400 text-lg", children: "No notes yet. Create your first note above! 👆" }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: notes.map((note) => /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow", children: editingId === note.id ? (
      // Edit mode
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("input", { type: "text", value: editTitle, onChange: (e) => setEditTitle(e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" }),
        /* @__PURE__ */ jsx("textarea", { value: editContent, onChange: (e) => setEditContent(e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white min-h-[100px]" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => handleUpdate(note.id), className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors", children: "Save" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setEditingId(null), className: "flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors", children: "Cancel" })
        ] })
      ] })
    ) : (
      // View mode
      /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-2 text-gray-900 dark:text-white", children: note.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-wrap", children: note.content }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4", children: /* @__PURE__ */ jsx("span", { children: formatDate(note.updatedAt) }) }),
        deleteConfirmId === note.id ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(note.id), className: "flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors", children: "Confirm Delete" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setDeleteConfirmId(null), className: "flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors", children: "Cancel" })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => handleEdit(note), className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors", children: "Edit" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setDeleteConfirmId(note.id), className: "flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors", children: "Delete" })
        ] })
      ] })
    ) }, note.id)) })
  ] }) });
}
export {
  Home as component
};
