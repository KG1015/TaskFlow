import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import { LogOut, Plus, Search } from 'lucide-react';

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
    <div className="min-h-screen bg-spotify-black text-white font-sans flex flex-col">
      {/* Navigation */}
      <nav className="bg-spotify-black sticky top-0 z-10 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tighter">TaskFlow</h1>
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-spotify-text hover:text-white transition-colors cursor-pointer hidden sm:block">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-white bg-spotify-black hover:scale-105 transition-transform"
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        
        {/* Header Section */}
        <div className="bg-gradient-to-b from-[#282828] to-spotify-black p-8 rounded-xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 shadow-2xl">
          <div>
            <h2 className="text-5xl font-black tracking-tighter mb-2">Good morning</h2>
            <p className="text-spotify-text font-medium text-lg">
              You have {pendingTasks.length} pending task{pendingTasks.length !== 1 ? 's' : ''}.
            </p>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-8 py-3.5 bg-spotify-green text-black font-bold rounded-full hover:bg-spotify-hover hover:scale-105 transition-all"
            >
              <Plus className="h-5 w-5" />
              Add Task
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 text-red-400 p-4 rounded-md text-sm font-medium border border-red-500/20">
            {error}
          </div>
        )}

        {/* Add Task Form */}
        {isAdding && (
          <div className="mb-10 bg-spotify-base p-6 rounded-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-spotify-highlight border-none rounded-sm focus:ring-1 focus:ring-white outline-none transition-shadow text-white placeholder-spotify-text font-medium"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Description (optional)"
                    rows="3"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-spotify-highlight border-none rounded-sm focus:ring-1 focus:ring-white outline-none transition-shadow resize-none text-white placeholder-spotify-text font-medium"
                  ></textarea>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-spotify-highlight">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-6 py-2.5 text-white font-bold hover:scale-105 transition-transform"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-spotify-green"></div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <section>
                <h3 className="text-2xl font-bold text-white mb-6">Pending</h3>
                <div className="grid gap-3">
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
                <h3 className="text-2xl font-bold text-white mb-6">Completed</h3>
                <div className="grid gap-3 opacity-80 hover:opacity-100 transition-opacity">
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
              <div className="text-center py-24 bg-spotify-base rounded-md">
                <Search className="mx-auto h-16 w-16 text-spotify-text mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">No tasks found</h3>
                <p className="text-spotify-text font-medium mb-8">It's pretty empty here. Let's add something to your list.</p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                >
                  Create your first task
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
