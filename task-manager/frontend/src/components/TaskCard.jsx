import React from 'react';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onUpdateStatus, onDelete }) => {
  const isCompleted = task.status === 'Completed';

  return (
    <div className={`p-4 rounded-xl border transition-all ${isCompleted ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>
      <div className="flex items-start justify-between gap-4">
        <button 
          onClick={() => onUpdateStatus(task.id, isCompleted ? 'Pending' : 'Completed')}
          className="mt-1 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
        >
          {isCompleted ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </button>
        
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1 text-sm ${isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
              {task.description}
            </p>
          )}
          <div className="mt-3 flex items-center text-xs text-slate-400">
            <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none p-1 rounded-md hover:bg-red-50"
          title="Delete task"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
