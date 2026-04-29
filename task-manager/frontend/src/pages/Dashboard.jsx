import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import { LogOut, Plus, ListTodo } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks`);
      setTasks(response.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/api/tasks`, {
        title: newTaskTitle,
        description: newTaskDesc,
      });
      setTasks([response.data, ...tasks]);
      setNewTaskTitle('');
      setNewTaskDesc('');
      setIsAdding(false);
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`${API_URL}/api/tasks/${id}`, {
        status: newStatus,
      });
      setTasks(tasks.map(t => t.id === id ? response.data : t));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <ListTodo className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">TaskFlow</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 hidden sm:block">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Action */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your Tasks</h2>
            <p className="mt-1 text-sm text-slate-500">
              You have {pendingTasks.length} pending task{pendingTasks.length !== 1 ? 's' : ''}.
            </p>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        {/* Add Task Form */}
        {isAdding && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-medium text-slate-800 mb-4">Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Description (optional)"
                    rows="3"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-none"
                  ></textarea>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Save Task
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Pending</h3>
                <div className="space-y-3">
                  {pendingTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onUpdateStatus={handleUpdateStatus}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Completed</h3>
                <div className="space-y-3">
                  {completedTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onUpdateStatus={handleUpdateStatus}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}

            {tasks.length === 0 && !isAdding && (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                <ListTodo className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-lg font-medium text-slate-900">No tasks yet</h3>
                <p className="mt-1 text-slate-500">Get started by creating a new task.</p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add your first task
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
