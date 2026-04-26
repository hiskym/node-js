import test from 'ava';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { app, db } from '../src/app.js';
import { todosTable } from '../src/schema.js';
import { eq } from "drizzle-orm";

test.beforeEach('migrate db', async () => {
    await migrate(db, { migrationsFolder: './drizzle' });
});

test.afterEach('close db', async () => {
    await db.delete(todosTable);
});

test.serial('shows todos', async (t) => {
    await db.insert(todosTable).values({ title: 'Todo1' });
    
    const res = await app.request('/')
    const html = await res.text();

    t.assert(html.includes('Todo1'));
});

test.serial('homepage without todos', async (t) => {
    const res = await app.request('/');
    t.is(res.status, 200);
});

test.serial('creates todo', async (t) => {
    const formData = new FormData();
    formData.set('title', 'TestTodo');

    const res = await app.request('/add', {
        method: 'POST',
        body: formData
    });

    t.is(res.status, 302);

    const location = res.headers.get('location');

    const res2 = await app.request(location, {
        method: 'GET'
    });

    const text = await res2.text();

    t.assert(text.includes('TestTodo'));

    const todo = await db.select().from(todosTable).where(eq(todosTable.title, 'TestTodo')).get();

    t.false(todo.done);
    t.is(todo.priority, 'medium');
});

test.serial('removes todo', async (t) => {
    const [{ id }] = await db.insert(todosTable).values({ title: 'TodoToRemove' }).returning({ id: todosTable.id });

    const res = await app.request(`/remove/${id}`, {
        method: 'GET'
    });

    t.is(res.status, 302);

    const location = res.headers.get('location');

    const res2 = await app.request(location, {
        method: 'GET'
    });

    const text2 = await res2.text();

    t.assert(!text2.includes('TodoToRemove'));

    const deletedTodo = await db.select().from(todosTable).where(eq(todosTable.id, id)).get();
    t.is(deletedTodo, undefined);
})

test.serial('toggles todo', async (t) => {
    const [{ id }] = await db.insert(todosTable).values({ title: 'TodoToToggle' }).returning({ id: todosTable.id });

    //todo should not be done by default
    const toggledTodo1 = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, id))
    .get();

    t.false(toggledTodo1.done);
    
    const res = await app.request(`/toggle/${id}`, {
        method: 'GET'
    });

    t.is(res.status, 302);

    const toggledTodo2 = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, id))
    .get();

    t.true(toggledTodo2.done);

    const res2 = await app.request(`/toggle/${id}`, {
        method: 'GET'
    });

    t.is(res2.status, 302);

    const toggledTodo3 = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, id))
    .get();

    t.false(toggledTodo3.done);

    //check referer
    const res3 = await app.request(`/toggle/${id}`, {
        headers: { referer: `/todo/${id}` }
    });

    t.is(res3.headers.get('location'), `/todo/${id}`);
})

test.serial('renames todo', async (t) => {
    const [{ id }] = await db.insert(todosTable).values({ title: 'TodoToRename' }).returning({ id: todosTable.id });

    const formData = new FormData();
    formData.set('title', 'TodoRenamed');

    const res = await app.request(`/rename/${id}`, {
        method: 'POST',
        body: formData
    });

    t.is(res.status, 302);

    const location = res.headers.get('location');

    const res2 = await app.request(location, {
        method: 'GET'
    });

    const text = await res2.text();

    t.assert(text.includes('TodoRenamed'));

    const updatedTodo = await db.select().from(todosTable).where(eq(todosTable.id, id)).get();
    t.is(updatedTodo.title, 'TodoRenamed');
});

test.serial('return 404 if id not found', async (t) => {
    //no todos in db
    const [ id ] = await db.select().from(todosTable).limit(1);

    const resToggle = await app.request(`/toggle/${id}`, {
        method: 'GET'
    });

    t.is(resToggle.status, 404);

    const formData = new FormData();
    formData.set('title', 'TodoRenamed');

    const resRename = await app.request(`/rename/${id}`, {
        method: 'POST',
        body: formData
    });

    t.is(resRename.status, 404);

    const resTodoDetail = await app.request(`/todo/${id}`, {
        method: 'GET'
    });

    t.is(resTodoDetail.status, 404);

    const resRemove = await app.request(`/remove/${id}`, {
        method: 'GET'
    });

    t.is(resRemove.status, 404);

    const switchPriorityFormData = new FormData();
    switchPriorityFormData.set('priority', 'high');

    const resSwitchPriority = await app.request(`/switch-priority/${id}`, {
        method: 'POST',
        body: switchPriorityFormData
    });

    t.is(resSwitchPriority.status, 404);
})

test.serial('return 404 if id has wrong format', async (t) => {
    //no todos in db
    const id = 'banan';

    const resToggle = await app.request(`/toggle/${id}`, {
        method: 'GET'
    });

    t.is(resToggle.status, 404);

    const formData = new FormData();
    formData.set('title', 'TodoRenamed');

    const resRename = await app.request(`/rename/${id}`, {
        method: 'POST',
        body: formData
    });

    t.is(resRename.status, 404);

    const resTodoDetail = await app.request(`/todo/${id}`, {
        method: 'GET'
    });

    t.is(resTodoDetail.status, 404);

    const resRemove = await app.request(`/remove/${id}`, {
        method: 'GET'
    });

    t.is(resRemove.status, 404);

    const switchPriorityFormData = new FormData();
    switchPriorityFormData.set('priority', 'high');

    const resSwitchPriority = await app.request(`/switch-priority/${id}`, {
        method: 'POST',
        body: switchPriorityFormData
    });

    t.is(resSwitchPriority.status, 404);
})

test.serial('return 404 if page does not exist', async (t) => {
    const resRandom = await app.request(`/random-page`, {
        method: 'GET'
    });

    t.is(resRandom.status, 404);
})

test.serial('show todo detail', async (t) => {
    const [{ id }] = await db.insert(todosTable).values({ title: 'Todocko' }).returning({ id: todosTable.id });

    const resTodoDetail = await app.request(`/todo/${id}`, {
        method: 'GET'
    });

    t.is(resTodoDetail.status, 200);

    const text = await resTodoDetail.text();

    t.assert(text.includes('Todocko'));
})

test.serial('switch priority', async (t) => {
    const [{ id }] = await db.insert(todosTable).values({ title: 'TodoWithPriority' }).returning({ id: todosTable.id });

    const formData = new FormData();
    formData.set('priority', 'high');

    const res = await app.request(`/switch-priority/${id}`, {
        method: 'POST',
        body: formData
    });

    t.is(res.status, 302);

    const updatedTodo = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, id))
    .get();

    t.true(updatedTodo.priority === 'high');

    const location = res.headers.get('location');

    const res2 = await app.request(location, {
        method: 'GET'
    });

    const text = await res2.text();

    t.assert(text.includes('Vysoká'));

    //test invalid priority
    const formData2 = new FormData();

    formData2.set('priority', 'banan');

    const res3 = await app.request(`/switch-priority/${id}`, {
        method: 'POST',
        body: formData2,
    });

    t.is(res3.status, 400);
})