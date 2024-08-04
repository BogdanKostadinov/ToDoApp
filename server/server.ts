import express, { Request, Response } from 'express';
const app = express();
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Task from '../src/app/models/task.model';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env['PORT'] ? process.env['PORT'] : 3500;

// Middleware
app.use(express.json());

const allowedOrigins = ['http://localhost:4200', 'http://localhost:3500'];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));
// comment 
const getDBData = async (): Promise<Array<Task>> => {
  try {
    const dbData = await fs.readFile(
      path.join(__dirname, '..', 'db', 'db.json'),
      'utf-8'
    );
    const dbDataJSON: Array<Task> = JSON.parse(dbData);
    return dbDataJSON;
  } catch (error) {
    console.log('getDBData error: ', error);
    throw new Error('Could not get DB data.');
  }
};

// Requests
app.get('/tasks', async (req: Request, res: Response) => {
  try {
    const dbData = await getDBData();

    if (!dbData || dbData.length <= 0) return res.sendStatus(404);

    return res.status(200).send(dbData);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

app.get('/task/:id', async (req: Request, res: Response) => {
  const taskToGetID = parseInt(req.params['id']);

  try {
    const dbData = await getDBData();

    const filteredTask = dbData.find((task: Task) => task.id === taskToGetID);

    if (!filteredTask) return res.sendStatus(404);

    return res.status(200).send(filteredTask);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

app.post('/task', async (req: Request, res: Response) => {
  const newTask = {
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    completed: req.body.completed,
  };

  try {
    const dbData = await getDBData();

    const newTaskList: Array<Task> = [...dbData, newTask];

    await fs.writeFile(
      path.join(__dirname, '..', 'db', 'db.json'),
      JSON.stringify(newTaskList)
    );

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

app.put('/task/:id', async (req: Request, res: Response) => {
  const dbData = await getDBData();
  const taskToEditID = parseInt(req.params['id']);

  const fileteredTask: Task | undefined = dbData.find(
    (task: Task) => task.id === taskToEditID
  );

  if (!fileteredTask) res.status(404).send('Task does not exist.');

  const editedTask = {
    id: taskToEditID,
    name: req.body.name,
    description: req.body.description,
    completed: req.body.completed,
  };

  const filteredDBArray = dbData.filter((task) => task.id !== taskToEditID);

  const newTaskList = [...filteredDBArray, editedTask];
  newTaskList.sort((a, b) => a.id - b.id);
  try {
    await fs.writeFile(
      path.join(__dirname, '..', 'db', 'db.json'),
      JSON.stringify(newTaskList)
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.delete('/task/:id', async (req: Request, res: Response) => {
  const dbData = await getDBData();
  const taskToDeleteID: number = parseInt(req.params['id']);

  const fileteredTaskList: Array<Task> = dbData.filter(
    (task: Task) => task.id !== taskToDeleteID
  );

  for (let i = 0; i < fileteredTaskList.length; i++) {
    fileteredTaskList[i].id = i + 1;
  }

  try {
    await fs.writeFile(
      path.join(__dirname, '..', 'db', 'db.json'),
      JSON.stringify(fileteredTaskList)
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
