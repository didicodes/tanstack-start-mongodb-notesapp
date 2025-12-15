import { jsxs, jsx } from "react/jsx-runtime";
import { useRouter, useMatch, rootRouteId, ErrorComponent, Link, createRootRoute, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { T as TSS_SERVER_FUNCTION, g as getServerFnById, c as createServerFn } from "../server.js";
import { ObjectId } from "mongodb";
import { g as getNotesCollection, d as documentToNote, c as createNoteSchema, u as updateNoteSchema, a as deleteNoteSchema } from "./types-CZ_5aSfc.js";
function DefaultCatchBoundary({ error }) {
  const router2 = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId
  });
  console.error("DefaultCatchBoundary Error:", error);
  return /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6", children: [
    /* @__PURE__ */ jsx(ErrorComponent, { error }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center flex-wrap", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
          },
          className: `px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`,
          children: "Try Again"
        }
      ),
      isRoot ? /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: `px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`,
          children: "Home"
        }
      ) : /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: `px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`,
          onClick: (e) => {
            e.preventDefault();
            window.history.back();
          },
          children: "Go Back"
        }
      )
    ] })
  ] });
}
function NotFound({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-2", children: [
    /* @__PURE__ */ jsx("div", { className: "text-gray-600 dark:text-gray-400", children: children || /* @__PURE__ */ jsx("p", { children: "The page you are looking for does not exist." }) }),
    /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => window.history.back(),
          className: "bg-emerald-500 text-white px-2 py-1 rounded-sm uppercase font-black text-sm",
          children: "Go back"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: "bg-cyan-600 text-white px-2 py-1 rounded-sm uppercase font-black text-sm",
          children: "Start Over"
        }
      )
    ] })
  ] });
}
const appCss = "/assets/app-tnRWdcZi.css";
const seo = ({
  title,
  description,
  keywords,
  image
}) => {
  const tags = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:creator", content: "@tannerlinsley" },
    { name: "twitter:site", content: "@tannerlinsley" },
    { name: "og:type", content: "website" },
    { name: "og:title", content: title },
    { name: "og:description", content: description },
    ...image ? [
      { name: "twitter:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "og:image", content: image }
    ] : []
  ];
  return tags;
};
const Route$1 = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      ...seo({
        title: "TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `
      })
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png"
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" }
    ],
    scripts: [
      {
        src: "/customScript.js",
        type: "text/javascript"
      }
    ]
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => /* @__PURE__ */ jsx(NotFound, {}),
  shellComponent: RootDocument
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx("hr", {}),
      children,
      /* @__PURE__ */ jsx(TanStackRouterDevtools, { position: "bottom-right" }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const fn = async (...args) => {
    const serverFn = await getServerFnById(functionId);
    return serverFn(...args);
  };
  return Object.assign(fn, {
    url,
    functionId,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getNotes_createServerFn_handler = createSsrRpc("f82fe0a8823169db464e13d5360ffb9c7ccf24363fad78ef08fde052634583c2");
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
const createNote_createServerFn_handler = createSsrRpc("adf580c99fe4703be66856341616b124bacfeb6f1f282e1c6e4d7c60686bf5c1");
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
const updateNote_createServerFn_handler = createSsrRpc("8cd0049a2c6d3795ac04002ca8d0fdd5a5a70a8980aa24b7c51f9d36b6d1ff87");
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
const deleteNote_createServerFn_handler = createSsrRpc("2f477c26e719e33c03cb4057a2c6bd9e41c72ef1f2554aa8cd40762c5bc1a94d");
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
const $$splitComponentImporter = () => import("./index-DhUIqMPz.js");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  loader: async () => {
    const notes = await getNotes();
    return {
      notes
    };
  }
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$1
});
const rootRouteChildren = {
  IndexRoute
};
const routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router2 = createRouter({
    routeTree,
    defaultPreload: "intent",
    // Preload on hover
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => /* @__PURE__ */ jsx(NotFound, {}),
    scrollRestoration: true
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route as R,
  createNote as c,
  deleteNote as d,
  getNotes as g,
  router as r,
  updateNote as u
};
