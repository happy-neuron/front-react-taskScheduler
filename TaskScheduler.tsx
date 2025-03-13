import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate: Date;
    priority: Priority;
    status: Status;
    estimatedTime: number; // en minutes
}

export interface NewTask {
    title: string;
    description?: string;
    dueDate: Date;
    priority: Priority;
    estimatedTime: number;
}

export interface TaskSchedulerHandle {
    addTask: (task: NewTask) => string;
}

interface TaskSchedulerProps {
    initialTasks?: Task[];
    onTaskStatusChange?: (taskId: string, newStatus: Status) => void;
}

const getStatusStyles = (status: Status) => {
    switch (status) {
    case 'completed': return 'border-green-300 bg-green-50';
    case 'in-progress': return 'border-blue-300 bg-blue-50';
    case 'cancelled': return 'border-gray-300 bg-gray-50';
    default: return 'border-yellow-300 bg-yellow-50';
    }
};

const TaskScheduler = forwardRef<TaskSchedulerHandle, TaskSchedulerProps>(({
    initialTasks = [],
    onTaskStatusChange
}, ref) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    
    useImperativeHandle(ref, () => ({
        addTask: (taskData:NewTask) => {
            const id = Math.random().toString(36);
            const newTask:Task = { ...taskData, id: id, status: 'pending' };
            setTasks(prev => [...prev, newTask]);
            return id;
        }
    }));

    const filteredTasks = useCallback(() => {
        return tasks.filter(task => {
        const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
        const matchesSearch = searchTerm === '' || 
                task.title.indexOf(searchTerm) > -1 ||
                (task.description?.indexOf(searchTerm) > -1);
        return matchesPriority && matchesSearch;
        });
    }, [tasks, selectedPriority, searchTerm]);

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    const updateTaskStatus = (taskId, newStatus) => {
        const newTasks = [...tasks];
        for(let i = 0; i < newTasks.length; i++) {
            if (newTasks[i].id === taskId) {
                newTasks[i].status  = newStatus;
            }
        }
        setTasks(newTasks);
        onTaskStatusChange?.(taskId, newStatus);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestionnaire de tâches</h2>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Rechercher des tâches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as Priority | 'all')}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Toutes les priorités</option>
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                </select>
                </div>
            </div>
            
            <div className="space-y-3">
                {
                    filteredTasks().map(task => (
                        <div key={task.id} className={`p-4 border rounded-md ${getStatusStyles(task.status)}`}>
                            <div className="flex justify-between">
                                <h3 className="font-semibold text-gray-800">{task.title}</h3>
                                <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    task.status === 'completed' ? 'bg-green-200 text-green-800' :
                                    task.status === 'in-progress' ? 'bg-blue-200 text-blue-800' :
                                    task.status === 'cancelled' ? 'bg-gray-200 text-gray-800' :
                                    'bg-yellow-200 text-yellow-800'
                                }`}>
                                    {task.status}
                                </span>
                                </div>
                            </div>
                            
                            <div className="mt-2 text-sm text-gray-600">
                                {task.description && <p>{task.description}</p>}
                                <p className="mt-1">
                                Échéance: {task.dueDate.toDateString()} • 
                                Temps estimé: {task.estimatedTime} min
                                </p>
                            </div>
                            
                            <div className="mt-3 flex gap-2">
                                {task.status !== 'completed' && (
                                <button
                                    onClick={() => updateTaskStatus(task.id, 'completed')}
                                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                >
                                    Terminer
                                </button>
                                )}
                                
                                {task.status === 'pending' && (
                                <button
                                    onClick={() => updateTaskStatus(task.id, 'in-progress')}
                                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                >
                                    Démarrer
                                </button>
                                )}
                                
                                {(task.status === 'pending' || task.status === 'in-progress') && (
                                <button
                                    onClick={() => updateTaskStatus(task.id, 'cancelled')}
                                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                                >
                                    Annuler
                                </button>
                                )}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
});

export default TaskScheduler;