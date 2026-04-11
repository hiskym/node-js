import { Hono } from "hono";
import { serve } from "@hono/node-server";
import ejs from "ejs";
import { drizzle } from "drizzle-orm/libsql"
import { eq } from "drizzle-orm";
import { todosTable } from "./src/schema.js";
import { serveStatic } from "@hono/node-server/serve-static";
import { createNodeWebSocket } from '@hono/node-ws'
import { WSContext } from 'hono/ws'

const db = drizzle({
  connection: "file:db.sqlite",
  logger: true,
})

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app })

app.use('/styles/*', serveStatic({ root: './public' }))

app.get(async (c, next) => {
    console.log(c.req.method, c.req.url);
    await next();
})

/**
 * @type {Set<WSContext<WebSocket>>}
 */
let webSockets = new Set()

app.get(
  '/ws',
  upgradeWebSocket((c) => ({
    onOpen: (evt, ws) => {
      webSockets.add(ws)
      console.log('open web sockets:', webSockets.size)
    },
    onMessage: () => {
      console.log('message')
    },
    onClose: (evt, ws) => {
      console.log('close')
      webSockets.delete(ws)
    },
  })),
)

app.get('/', async (c) => {
    const todos = await db.select().from(todosTable).all();

    const html = await ejs.renderFile('./views/index.html', { todos })
    return c.html(html);
})

app.post('/add', async (c) => {
    const body = await c.req.formData();
    const title  = body.get('title');

    await db.insert(todosTable).values({
        title,
        done: 0
    })

    sendTodosToAllWebsockets();

    return c.redirect("/");
})

app.get('/remove/:id', async c => {
    const id = Number(c.req.param('id'));

    await db.delete(todosTable).where(eq(todosTable.id, id))

    console.log('id1'+ id)

    sendTodosToAllWebsockets();
    sendTodoDetailToAllWebsockets(id, true);

    console.log('id2'+ id)

    return c.redirect("/");
})

app.get('/toggle/:id', async c => {
    const id = Number(c.req.param('id'));

    const todo = await db.select().from(todosTable).where(eq(todosTable.id, id)).get();

    if (!todo) return c.notFound();

    await db.update(todosTable).set({ done: !todo.done }).where(eq(todosTable.id, id))

    const referer = c.req.header('referer')

    sendTodosToAllWebsockets();
    sendTodoDetailToAllWebsockets(id);

    if (referer) return c.redirect(referer)

    return c.redirect("/");
})

app.get('/todo/:id', async c => {
    const id = Number(c.req.param('id'));

    const todo = await db.select().from(todosTable).where(eq(todosTable.id, id)).get();

    if (!todo) return c.notFound();

    const html = await ejs.renderFile('./views/todo.html', { todo });

    return c.html(html);
})

const sendTodosToAllWebsockets = async () => {
  try {
    const todos = await db.select().from(todosTable).all()

    const html = await ejs.renderFile('views/_todos.html', {
      todos
    })

    for (const webSocket of webSockets) {
      webSocket.send(
        JSON.stringify({
          type: 'todos',
          html,
        }),
      )
    }
  } catch (e) {
    console.error(e)
  }
}

const sendTodoDetailToAllWebsockets = async (id, removed = false) => {
  try {
    if (removed) {
      for (const webSocket of webSockets) {
        webSocket.send(
          JSON.stringify({
            type: 'removed-todo',
            todoId: id,
          }),
        );
      }
      
      return;
    }

    const todo = await db.select().from(todosTable).where(eq(todosTable.id, id)).get();

    if (!todo) return;

    const html = await ejs.renderFile('./views/_todo-detail.html', {
      todo
    });

    for (const webSocket of webSockets) {
      webSocket.send(
        JSON.stringify({
          type: 'todo-detail',
          todoId: id,
          html,
        }),
      );
    }
  } catch (e) {
    console.error(e);
  }
}


app.post('/rename/:id', async c => {
    const id = Number(c.req.param('id'));

    const body = await c.req.formData();
    const title  = body.get('title');

    const todo = await db.select().from(todosTable).where(eq(todosTable.id, id)).get();
    
    if (!todo) {
        return c.html(`
            <html>
                <body>
                <script>
                    alert("Todo nenalezeno");
                    window.location.href = "/";
                </script>
                </body>
            </html>
            `);
    }

    await db.update(todosTable).set({ title }).where(eq(todosTable.id, id))

    sendTodosToAllWebsockets();
    sendTodoDetailToAllWebsockets(id);

    return c.redirect(`/todo/${id}`);
})

app.post('/switch-priority/:id', async c => {
    const id = Number(c.req.param('id'));
    const body = await c.req.formData();

    const priority = body.get('priority');

    const todo = await db.select().from(todosTable).where(eq(todosTable.id, id)).get();

    if (!todo) return c.notFound();

    await db.update(todosTable).set({ priority: priority }).where(eq(todosTable.id, id))

    sendTodosToAllWebsockets();
    sendTodoDetailToAllWebsockets(id);

    return c.redirect(`/todo/${id}`);
})

app.use(async c => {
    c.status(404);
    return c.html(await ejs.renderFile('./views/404.html'));
})

app.get('/test', (c) => {
    return c.html('<h1>test</h1>');
})

app.get('/hello/:name', async c => {
    const name = c.req.param('name');
    return c.html('hi ' + name);
})

const server = serve(app, (info) => {
    console.log(`Server started on http://localhost:${info.port}`)
})

injectWebSocket(server)