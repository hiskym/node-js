import { Hono } from "hono";
import { routePath } from "hono/route"
import { serve } from "@hono/node-server";
import fs from "fs/promises"
import ejs from "ejs";

const app = new Hono();

let todos = [
    {
    id: 1,
    title: "pivko",
    done: false
    },
    {
    id: 2,
    title: "jit na cviko",
    done: true
    },
]

app.get(async (c, next) => {
    console.log(c.req.method, c.req.url);
    await next();
})

app.get('/', async (c) => {
    const html = await ejs.renderFile('./views/index.html', { todos })
    return c.html(html);
})

app.post('/add', async (c) => {
    const body = await c.req.formData();
    const title  = body.get('title');

    todos.push({
        id: todos.length + 1,
        title,
        done: false
    })

    return c.redirect("/");
})

app.get('/remove/:id', async c => {
    const id = Number(c.req.param('id'));

    todos = todos.filter(t => t.id !== id);

    return c.redirect("/");
})

app.get('/toggle/:id', async c => {
    const id = Number(c.req.param('id'));

    const todo = todos.find((t) => t.id === id);

    if (todo) {
        todo.done = !todo.done;
    }

    const referer = c.req.header('referer')

    if (referer) return c.redirect(referer)

    return c.redirect("/");
})

app.get('/todo/:id', async c => {
    const id = Number(c.req.param('id'));

    const todo = todos.find((t) => t.id === id);

    if (!todo) {
        c.status(404);
        return c.html('<h1>todo not found</h1>');
    }

    const html = await ejs.renderFile('./views/todo.html', { todo });

    return c.html(html);
})

app.post('/rename/:id', async c => {
    const id = Number(c.req.param('id'));

    const body = await c.req.formData();
    const title  = body.get('title');

    const todo = todos.find((t) => t.id === id);
    
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

    todo.title = title;

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