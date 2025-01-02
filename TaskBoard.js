import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique task IDs

const ItemType = 'TASK';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAddTask = (task) => {
    const newTask = {
      id: uuidv4(),
      title: task.title,
      description: task.description,
      status: 'To Do',
    };
    setTasks([...tasks, newTask]);
  };

  const moveTask = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const renderTasks = (status) => {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          moveTask={moveTask}
          deleteTask={deleteTask}
        />
      ));
  };

  return (
    <div>
      <TaskForm onAddTask={handleAddTask} />
      <div style={styles.boardContainer}>
        {['To Do', 'In Progress', 'Done'].map((status) => (
          <Column key={status} status={status} moveTask={moveTask}>
            {renderTasks(status)}
          </Column>
        ))}
      </div>
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
};

const Column = ({ status, children, moveTask }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item) => moveTask(item.id, status),
  });

  return (
    <div ref={drop} style={styles.column}>
      <h3 style={styles.columnHeader}>{status}</h3>
      <div style={styles.taskList}>{children}</div>
    </div>
  );
};



const TaskCard = ({ task, moveTask, deleteTask }) => {
  const [, drag] = useDrag({
    type: ItemType,
    item: { id: task.id },
  });

  return (
    <div ref={drag} style={styles.taskCard}>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <button
        onClick={() => deleteTask(task.id)}
        style={styles.deleteButton}
      >
        Delete Task
      </button>
    </div>
  );
};

const styles = {
  boardContainer: {
    display: 'flex',
    flexDirection: 'row', // Align sections horizontally
    gap: '1rem',
    marginTop: '1rem',
  },
  column: {
    flex: 1,
    border: '2px solid #ddd',
    borderRadius: '5px',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    height: '400px', // Fixed height for each column
    overflowY: 'auto', // Add vertical scroll bar if tasks overflow
  },
  columnHeader: {
    textAlign: 'center',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'row', // Align tasks horizontally
    gap: '1rem',
    flexWrap: 'wrap', // Wrap tasks if they overflow horizontally
  },
  taskCard: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '1rem',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    minWidth: '150px', // Set a minimum width for each task
  },
  deleteButton: {
    marginTop: '10px',
    padding: '5px 10px',
    color: 'white',
    backgroundColor: 'red',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
};

export default TaskBoard;
