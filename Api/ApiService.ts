import Task from '../model/Task';

// const PORT = process.env['PORT'] ? process.env['PORT'] : 3500;
const PORT = 3500;

const URL = `http://localhost:${PORT}`;
//  process.env['URL']
//   ? process.env['URL']
//   : `http://localhost:${PORT}`;

export default class ApiService {
  private static async createApiRequest(method: string, body: string) {
    const options: RequestInit = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) options.body = body;

    await fetch(`${URL}/task`, options);
  }
  static async getAllTasks(): Promise<Response> {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const taskData = await fetch(`${URL}/tasks`, options);
      return taskData;
    } catch (error) {
      console.log('getAllTasks error: ', error);
      throw new Error('Could not get tasks.');
    }
  }

  static async createTask(newTask: Task) {
    if (!newTask) throw new Error('No parameter newTask.');

    // const options: RequestInit = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(newTask),
    // };
    try {
      await ApiService.createApiRequest('POST', JSON.stringify(newTask));
    } catch (error) {
      console.log('createTask error:', error);
      throw new Error('Task was not created');
    }
  }

  static async deleteTask(taskID: number) {
    if (!taskID) throw new Error('No taskID.');
    // const options: RequestInit = {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     id: taskID,
    //   }),
    // };
    const requestBodyy = {
      id: taskID,
    };
    try {
      await ApiService.createApiRequest('DELETE', JSON.stringify(requestBodyy));
    } catch (error) {
      console.log('deleteTask error:', error);
      throw new Error('Task was not deleted.');
    }
  }

  static async editTask(editedTask: Task) {
    if (!editedTask) throw new Error('No editedTask.');

    // const options: RequestInit = {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(editedTask),
    // };
    try {
      await ApiService.createApiRequest('PUT', JSON.stringify(editedTask));
    } catch (error) {
      console.log('editTask error:', error);
      throw new Error('Task was not edited');
    }
  }
}
