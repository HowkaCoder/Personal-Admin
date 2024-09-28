import React, { useState, useEffect } from 'react';
import './styles/ManagerFifthpage.css';
import config from '../../config';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function ManagerFifthpage() {
    const [userInfo, setUserInfo] = useState(null);
    const [projects, setProjects] = useState([]);
    const [projectID, setProjectID] = useState('');
    const [job, setJob] = useState('');
    const [necessaryMoney, setNecessaryMoney] = useState('');
    const [paidMoney, setPaidMoney] = useState('');
    const [deadline, setDeadline] = useState('');
    const [progress, setProgress] = useState('');
    const [status, setStatus] = useState('');
    const [position, setPosition] = useState('');

    useEffect(() => {
        const authData = Cookies.get('authData');
        if (authData) {
            const parsedAuthData = JSON.parse(authData);
            setUserInfo(parsedAuthData);

            axios.get(`${config.backendUrl}/api/projects`, {
                headers: {
                    'Authorization': `Bearer ${parsedAuthData.token}`
                }
            })
            .then((response) => {
                setProjects(response.data);
            })
            .catch((error) => console.log(error));
        }
    }, []);

    // Валидация данных перед отправкой
    const validateFormData = () => {
        if (!projectID) {
            console.error('Project ID is required');
            return false;
        }
        if (!job.trim()) {
            console.error('Job name is required');
            return false;
        }
        if (!position || isNaN(position)) {
            console.error('Position should be a number');
            return false;
        }
        if (!necessaryMoney || isNaN(necessaryMoney)) {
            console.error('Necessary money should be a number');
            return false;
        }
        if (!paidMoney || isNaN(paidMoney)) {
            console.error('Paid money should be a number');
            return false;
        }
        if (!progress || isNaN(progress)) {
            console.error('Progress should be a number');
            return false;
        }
        if (!status.trim()) {
            console.error('Status is required');
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateFormData()) {
            console.log("Form data is invalid. Please correct the errors.");
            return;
        }

        // Собираем данные в объект
        const formData = {
            project_id: parseInt(projectID), 
            job, 
            position: parseInt(position), 
            necessary_money: parseInt(necessaryMoney), 
            paid_money: parseInt(paidMoney), 
            deadline: deadline,  // Если формат даты не важен, можно передавать null
            done_part: parseInt(progress), 
            status
        };

        // Логирование данных перед отправкой
        console.log("Prepared form data for submission:", JSON.stringify(formData));

        axios.post(`${config.backendUrl}/api/states`, formData, {
            headers: {
                'Authorization': `Bearer ${userInfo.token}`,
                'Content-Type': 'application/json' // Указываем формат JSON
            }
        })
        .then(response => {
            console.log("Submitted successfully:", response.data);
        })
        .catch(error => {
            console.error("Submission failed:", error);
        });
    };

    // Обработчик изменения поля
    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    return (
        <div className='managerFifthpage'>
            <div className="fifth-container">
                <h2>Project Details</h2>
                <select value={projectID} onChange={(e) => setProjectID(e.target.value)}>
                    <option value="" disabled>Select a project</option>
                    {projects && projects.map((project) => (
                        <option key={project.ID} value={project.ID}>
                            {project.title} ID {project.ID}
                        </option>
                    ))}
                </select>
                <label>Название работы</label>
                <input 
                    type="text" 
                    placeholder="Enter job name" 
                    value={job} 
                    onChange={handleInputChange(setJob)} 
                />
                <label>Позиция</label>
                <input 
                    type="text" 
                    placeholder="Enter position" 
                    value={position} 
                    onChange={handleInputChange(setPosition)} 
                />
                <label>Необходимые деньги</label>
                <input 
                    type="text" 
                    placeholder="Enter required money" 
                    value={necessaryMoney} 
                    onChange={handleInputChange(setNecessaryMoney)} 
                />
                <label>Заплаченные деньги</label>
                <input 
                    type="text" 
                    placeholder="Enter paid money" 
                    value={paidMoney} 
                    onChange={handleInputChange(setPaidMoney)} 
                />
                <label>Дедлайн</label>
                <input 
                    type="text" 
                    placeholder="Enter deadline" 
                    value={deadline} 
                    onChange={handleInputChange(setDeadline)} 
                />
                <label>Прогресс в процентах</label>
                <input 
                    type="text" 
                    placeholder="Enter progress percentage" 
                    value={progress} 
                    onChange={handleInputChange(setProgress)} 
                />
                <label>Статус</label>
                <input 
                    type="text" 
                    placeholder="Enter status" 
                    value={status} 
                    onChange={handleInputChange(setStatus)} 
                />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}
