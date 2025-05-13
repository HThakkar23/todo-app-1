import React, { useState, useEffect } from 'react';

const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'user', password: 'user123', role: 'user' },
];

const TodoApp = () => {
    const [userTasks, setUserTasks] = useState({});
    const [task, setTask] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [registeredUsers, setRegisteredUsers] = useState(users);
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || users;
        const storedLoggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        setRegisteredUsers(storedUsers);
        if (storedLoggedInUser) {
            setLoggedInUser(storedLoggedInUser);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }, [registeredUsers]);

    useEffect(() => {
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    }, [loggedInUser]);

    const handleLogin = () => {
        const user = registeredUsers.find(
            (u) => u.username === username && u.password === password
        );
        if (user) {
            setLoggedInUser(user);
            setError('');
        } else {
            setError('Invalid credentials');
        }
    };

    const handleRegister = () => {
        if (username.trim() && password.trim()) {
            const existingUser = registeredUsers.find(
                (u) => u.username === username
            );
            if (existingUser) {
                setError('Username already exists');
            } else if (password.length <= 8 && username !== 'admin') {
                setError('Password must be longer than 8 characters');
            } else {
                const newUser = { username, password, role: 'user' };
                setRegisteredUsers([...registeredUsers, newUser]);
                setError('');
                alert('Registration successful! You can now log in.');
            }
        } else {
            setError('Please fill in all fields');
        }
    };

    const handleLogout = () => {
        setLoggedInUser(null);
    };

    const addTask = () => {
        if (task.trim()) {
            const updatedTasks = userTasks[loggedInUser.username] || [];
            setUserTasks({
                ...userTasks,
                [loggedInUser.username]: [
                    ...updatedTasks,
                    { id: Date.now(), text: task, completed: false, dueDate: null, tag: selectedTag },
                ],
            });
            setTask('');
        }
    };

    const addTag = (newTag) => {
        if (newTag.trim() && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
        }
    };

    const setTaskDueDate = (id, date) => {
        const updatedTasks = userTasks[loggedInUser.username].map((t) =>
            t.id === id ? { ...t, dueDate: date } : t
        );
        setUserTasks({
            ...userTasks,
            [loggedInUser.username]: updatedTasks,
        });
    };

    const setSubTaskDueDate = (parentId, subTaskId, date) => {
        const updatedTasks = userTasks[loggedInUser.username].map((t) => {
            if (t.id === parentId) {
                const updatedSubTasks = t.subTasks.map((subTask) =>
                    subTask.id === subTaskId ? { ...subTask, dueDate: date } : subTask
                );
                return { ...t, subTasks: updatedSubTasks };
            }
            return t;
        });
        setUserTasks({
            ...userTasks,
            [loggedInUser.username]: updatedTasks,
        });
    };

    const toggleTaskCompletion = (id) => {
        const updatedTasks = userTasks[loggedInUser.username].filter((t) => t.id !== id);
        setUserTasks({
            ...userTasks,
            [loggedInUser.username]: updatedTasks,
        });
    };

    const addSubTask = (parentId, subTaskText) => {
        if (subTaskText.trim()) {
            const updatedTasks = userTasks[loggedInUser.username].map((t) => {
                if (t.id === parentId) {
                    const subTasks = t.subTasks || [];
                    return {
                        ...t,
                        subTasks: [...subTasks, { id: Date.now(), text: subTaskText, completed: false }],
                    };
                }
                return t;
            });
            setUserTasks({
                ...userTasks,
                [loggedInUser.username]: updatedTasks,
            });
        }
    };


    const getTagColor = (tag) => '#00008B';

    if (!loggedInUser) {
        return (
            <div style={{ padding: '16px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Login or Register</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ display: 'block', margin: '8px auto', padding: '8px', width: '80%' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ display: 'block', margin: '8px auto', padding: '8px', width: '80%' }}
                />
                <button
                    onClick={handleLogin}
                    style={{ backgroundColor: 'blue', color: 'white', padding: '8px 16px', borderRadius: '4px', marginTop: '8px' }}
                >
                    Login
                </button>
                <button
                    onClick={handleRegister}
                    style={{ backgroundColor: 'green', color: 'white', padding: '8px 16px', borderRadius: '4px', marginTop: '8px' }}
                >
                    Register
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        );
    }

    return (
        <div
            style={{
                padding: '16px',
                maxWidth: '600px',
                margin: '0 auto',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
            }}
        >
            <h1
                style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    textAlign: 'center',
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
            >
                To-Do App
            </h1>
            {loggedInUser.role === 'admin' && (
                <div style={{ marginBottom: '16px' }}>
                    <h2>Admin Panel</h2>
                    <p>Registered Users:</p>
                    <ul>
                        {registeredUsers.map((user) => (
                            <li key={user.username} style={{ marginBottom: '8px' }}>
                                <span>{user.username} (Password: {user.password})</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <button
                onClick={handleLogout}
                style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', borderRadius: '4px', marginBottom: '16px' }}
            >
                Logout
            </button>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    style={{
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        padding: '12px',
                        flex: '1',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '16px',
                        transition: 'border-color 0.3s ease',
                    }}
                    placeholder="Add a new task"
                    onFocus={(e) => (e.target.style.borderColor = '#00d4ff')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)')}
                />
                <button
                    onClick={addTask}
                    style={{
                        background: 'linear-gradient(90deg, #00d4ff, #007bff)',
                        color: 'white',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'background 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.target.style.background = 'linear-gradient(90deg, #007bff, #00d4ff)')}
                    onMouseLeave={(e) => (e.target.style.background = 'linear-gradient(90deg, #00d4ff, #007bff)')}
                >
                    Add
                </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <input
                    type="text"
                    placeholder="Add a new tag"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            addTag(e.target.value);
                            e.target.value = '';
                        }
                    }}
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        marginRight: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                />
                <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        color: getTagColor(selectedTag),
                        fontWeight: 'bold',
                    }}
                >
                    <option value="" style={{ color: '#00008B' }}>No Tag</option>
                    {tags.map((tag) => (
                        <option key={tag} value={tag} style={{ color: '#00008B' }}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>

            <ul style={{ listStyle: 'none', padding: '0' }}>
                {(userTasks[loggedInUser.username] || []).map((t) => (
                    <li
                        key={t.id}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '16px',
                            marginBottom: '8px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            textDecoration: t.completed ? 'line-through' : 'none',
                            color: t.completed ? 'gray' : '#00008B',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <div>
                            <input
                                type="checkbox"
                                checked={t.completed}
                                onChange={() => toggleTaskCompletion(t.id)}
                                style={{ marginRight: '8px' }}
                            />
                            {t.text}
                            <input
                                type="text"
                                placeholder="Add a sub-task"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addSubTask(t.id, e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                                style={{
                                    marginLeft: '16px',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: '#ffffff',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                }}
                            />
                            <input
                                type="date"
                                onChange={(e) => setTaskDueDate(t.id, e.target.value)}
                                style={{
                                    marginLeft: '16px',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: '#ffffff',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                }}
                            />
                        </div>
                        {t.subTasks && (
                            <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '8px' }}>
                                {t.subTasks.map((subTask) => (
                                    <li
                                        key={subTask.id}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            padding: '8px',
                                            marginBottom: '4px',
                                            borderRadius: '8px',
                                            textDecoration: subTask.completed ? 'line-through' : 'none',
                                            color: subTask.completed ? 'gray' : '#ffffff',
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={subTask.completed}
                                            onChange={() => {
                                                const updatedTasks = userTasks[loggedInUser.username].map((task) => {
                                                    if (task.id === t.id) {
                                                        const updatedSubTasks = task.subTasks.map((st) =>
                                                            st.id === subTask.id
                                                                ? { ...st, completed: !st.completed }
                                                                : st
                                                        );
                                                        return { ...task, subTasks: updatedSubTasks };
                                                    }
                                                    return task;
                                                });
                                                setUserTasks({
                                                    ...userTasks,
                                                    [loggedInUser.username]: updatedTasks,
                                                });
                                            }}
                                            style={{ marginRight: '8px' }}
                                        />
                                        {subTask.text}
                                        <input
                                            type="date"
                                            onChange={(e) => setSubTaskDueDate(t.id, subTask.id, e.target.value)}
                                            style={{
                                                marginLeft: '16px',
                                                padding: '4px',
                                                borderRadius: '4px',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                color: '#ffffff',
                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

            <div>
                {tags.map((tag) => (
                    <div
                        key={tag}
                        style={{
                            marginBottom: '16px',
                            color: '#00008B',
                        }}
                    >
                        <h3>{tag}</h3>
                        <ul style={{ listStyle: 'none', padding: '0' }}>
                            {(userTasks[loggedInUser.username] || [])
                                .filter((t) => t.tag === tag)
                                .map((t) => (
                                    <li
                                        key={t.id}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            padding: '16px',
                                            marginBottom: '8px',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                            textDecoration: t.completed ? 'line-through' : 'none',
                                            color: t.completed ? 'gray' : '#00008B',
                                        }}
                                    >
                                        {t.text}
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoApp;
