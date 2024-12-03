'use client';

import { useState, useEffect } from 'react';
import { dbAddTodo, dbGetTodos, dbAddAssignee, dbGetAssignees, dbAssignTodo, dbCompleteTodo } from "@/lib/actions";
import { Urgency } from '@prisma/client';

interface Assignee {
  id: string;
  name: string;
}

interface Todo {
  id: string;
  title: string;
  description: string | null;
  urgency: Urgency
  completed: boolean;
  assignees: {
    idiot: {
      id: string;
      name: string;
    };
  }[];
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newAssigneeName, setNewAssigneeName] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState('');
  const [selectedAssigneeId, setSelectedAssigneeId] = useState('');

  // Fetch todos and assignees
  useEffect(() => {
    const fetchData = async () => {
      const [storedTodos, storedAssignees] = await Promise.all([
        dbGetTodos(),
        dbGetAssignees()
      ]);
      setTodos(storedTodos);
      setAssignees(storedAssignees);
    };
    
    fetchData();
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await dbAddTodo(title, description);
    if (response) {
      setTodos(prev => [...prev, { ...response, assignees: [] }]);
      setTitle('');
      setDescription('');
    }
  };

  const addAssignee = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await dbAddAssignee(newAssigneeName);
    if (response) {
      setAssignees(prev => [...prev, response]);
      setNewAssigneeName('');
    }
  };

  const assignTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTodoId && selectedAssigneeId) {
      const success = await dbAssignTodo(selectedTodoId, selectedAssigneeId);
      if (success) {
        // Refresh todos to show new assignment
        const updatedTodos = await dbGetTodos();
        setTodos(updatedTodos);
      }
    }
  };

  const completeTodo = async (todoId: string) => {
    const response = await dbCompleteTodo(todoId);
    if (response) {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === todoId ? { ...todo, completed: true } : todo
        )
      );
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      
      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="mb-4">
        <input
          type="text"
          placeholder="Todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Todo
        </button>
      </form>

      {/* Add Assignee Form */}
      <form onSubmit={addAssignee} className="mb-4">
        <input
          type="text"
          placeholder="New assignee name"
          value={newAssigneeName}
          onChange={(e) => setNewAssigneeName(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Add Assignee
        </button>
      </form>

      {/* Assign Todo Form */}
      <form onSubmit={assignTodo} className="mb-4">
        <select
          value={selectedTodoId}
          onChange={(e) => setSelectedTodoId(e.target.value)}
          className="border p-2 mr-2"
          required
        >
          <option value="">Select Todo</option>
          {todos.map((todo) => (
            <option key={todo.id} value={todo.id}>
              {todo.title}
            </option>
          ))}
        </select>
        <select
          value={selectedAssigneeId}
          onChange={(e) => setSelectedAssigneeId(e.target.value)}
          className="border p-2 mr-2"
          required
        >
          <option value="">Select Assignee</option>
          {assignees.map((assignee) => (
            <option key={assignee.id} value={assignee.id}>
              {assignee.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">
          Assign Todo
        </button>
      </form>

      {/* Todo List */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="border-b py-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-bold ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.title}
                </h3>
                {todo.description && <p>{todo.description}</p>}
                <div className="text-sm text-gray-600">
                  Assignees: {todo.assignees.map(a => a.idiot.name).join(', ') || 'None'}
                </div>
                <UrgencyBadge urgency={todo.urgency}/>
              </div>
              {!todo.completed && (
                <button
                  onClick={() => completeTodo(todo.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  Complete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}



type UrgencyBadgeProps = {
  urgency: Urgency
}

const UrgencyBadge = ({urgency}: UrgencyBadgeProps) => {
  const styles = {
    SUPER: 'bg-red-100 text-red-800 border-red-200',
    NORMAL: 'bg-blue-100 text-blue-800 border-blue-200',
    ZERO: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium border ${styles[urgency]}`}>
      {urgency}
    </span>
  );
};
