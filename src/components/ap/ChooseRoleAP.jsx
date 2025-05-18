import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/registerStyle.css';
import { HeaderContext } from '../../contexts/HeaderContext';
import { UserContext } from '../../contexts/UserContext';

const ChooseRoleAP = () => {
    const { setheaderState } = useContext(HeaderContext);
    const { setUser } = useContext(UserContext);
    const novigate = useNavigate();

    const setRole = (role, url) => {
        setUser(role);
        setheaderState(role);
        localStorage.setItem('role', role);
        novigate(url);
    };


    return (
        <div className="registerPage">
        <div className="registerContent">
            <div className="registerForm">
            <button
                className="submitButton"
                onClick={() => setRole('ADMIN', '/admin')}
            >
                Я админ
            </button>
            <button
                className="submitButton"
                onClick={() => setRole('ZONE_MANAGER', '/login')}
            >
                Я менеджер зоны
            </button>
            </div>
        </div>
        </div>
    );
};

export default ChooseRoleAP;