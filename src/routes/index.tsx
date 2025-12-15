import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "../server/notes";
import type { Note } from "../lib/types";

// Route configuration
/*
 * The loader pre-fetches data on the server before rendering.
 * This enables server-side rendering with initial data.
 */
export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => {
    const notes = await getNotes();
    return { notes };
  },
});

function Home() {
  const router = useRouter();

  // Get initial data from loader
  const { notes: initialNotes } = Route.useLoaderData();

  // Local state for real-time updates
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  /**
   * Refresh notes from server
   * Called after mutations to sync with database
   */
  const refreshNotes = async () => {
    const updated = await getNotes();
    setNotes(updated);
  };

  /**
   * Create a new note
   */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsCreating(true);
    try {
      await createNote({
        data: { title: title.trim(), content: content.trim() },
      });

      // Clear form
      setTitle("");
      setContent("");

      // Refresh list
      await refreshNotes();
    } catch (error) {
      console.error("Failed to create note:", error);
      alert("Failed to create note");
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Start editing a note
   */
  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  /**
   * Save edited note
   */
  const handleUpdate = async (id: string) => {
    try {
      await updateNote({
        data: {
          id,
          title: editTitle.trim(),
          content: editContent.trim(),
        },
      });
      setEditingId(null);
      await refreshNotes();
    } catch (error) {
      console.error("Failed to update note:", error);
      alert("Failed to update note");
    }
  };

  /**
   * Delete a note
   */
  const handleDelete = async (id: string) => {
    try {
      await deleteNote({ data: { id } });
      setDeleteConfirmId(null);
      await refreshNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note");
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📝 Notes App
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Built with TanStack Start + MongoDB
          </p>
        </header>

        {/* Create Note Form */}
        <div className="mb-8 max-w-2xl mx-auto">
          <form
            onSubmit={handleCreate}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Create New Note
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                maxLength={200}
              />
              <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white min-h-[100px]"
                maxLength={10000}
              />
              <button
                type="submit"
                disabled={!title.trim() || isCreating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating ? "Creating..." : "Create Note"}
              </button>
            </div>
          </form>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No notes yet. Create your first note above! 👆
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                {editingId === note.id ? (
                  // Edit mode
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(note.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {note.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>{formatDate(note.updatedAt)}</span>
                    </div>
                    {deleteConfirmId === note.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(note)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(note.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
