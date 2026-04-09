import { Hono } from "hono";
import { serve } from "@hono/node-server";
import ejs from "ejs";
import { drizzle } from "drizzle-orm/libsql"
import { eq } from "drizzle-orm";
import { todosTable } from "./src/schema.js";
import { serveStatic } from "@hono/node-server/serve-static";

const db = drizzle({
  connection: "file:db.sqlite",
  logger: true,
})

const app = new Hono();

// let todos = [
//     {
//     id: 1,
//     title: "pivko",
//     done: false
//     },
//     {
//     id: 2,
//     title: "jit na cviko",
//     done: true
//     },
// ]


app.use('/styles/*', serveStatic({ root: './public' }))

app.get(async (c, next) => {
    console.log(c.req.method, c.req.url);
    await next();
})

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

    return c.redirect("/");
})

app.get('/remove/:id', async c => {
    const id = Number(c.req.param('id'));

    await db.delete(todosTable).where(eq(todosTable.id, id)).eq

    return c.redirect("/");
})

app.get('/toggle/:id', async c => {
    const id = Number(c.req.param('id'));

    const todo = await db.select().from(todosTable).where(eq(todosTable.id, id)).get();

    if (!todo) return c.notFound();

    await db.update(todosTable).set({ done: !todo.done }).where(eq(todosTable.id, id))

    const referer = c.req.header('referer')

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

    return c.redirect(`/todo/${id}`);
})

app.post('/switch-priority/:id', async c => {
    const id = Number(c.req.param('id'));
    const body = await c.req.formData();

    const priority = body.get('priority');

    const todo = await db.select().from(todosTable).where(eq(todosTable.id, id)).get();

    if (!todo) return c.notFound();

    await db.update(todosTable).set({ priority: priority }).where(eq(todosTable.id, id))

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

serve({
    fetch: app.fetch,
    port: 8000
})