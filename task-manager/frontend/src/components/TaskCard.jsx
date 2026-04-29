import React from 'react';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onUpdateStatus, onDelete }) => {
  const isCompleted = task.status === 'Completed';

  return (
    <div className={`p-4 rounded-md transition-all ${isCompleted ? 'bg-spotify-black border-l-4 border-l-spotify-highlight hover:bg-spotify-highlight' : 'bg-spotify-highlight hover:bg-[#333333]'}`}>
      <div className="flex items-start justify-between gap-4 group">
        <button 
          onClick={() => onUpdateStatus(task.id, isCompleted ? 'Pending' : 'Completed')}
          className="mt-1 text-spotify-text hover:text-white transition-colors focus:outline-none"
        >
          {isCompleted ? (
            <CheckCircle className="h-6 w-6 text-spotify-green" />
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </button>
        
        <div className="flex-1">
          <h3 className={`font-bold text-base ${isCompleted ? 'text-spotify-text line-through' : 'text-white'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1 text-sm ${isCompleted ? 'text-spotify-text/70' : 'text-spotify-text'}`}>
              {task.description}
            </p>
          )}
          <div className="mt-3 flex items-center text-xs text-spotify-text/50">
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="text-spotify-text hover:text-red-500 transition-colors focus:outline-none p-2 rounded-full hover:bg-spotify-black opacity-0 group-hover:opacity-100"
          title="Delete task"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
