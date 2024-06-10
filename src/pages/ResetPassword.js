import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import ReactHtmlParser from "react-html-parser";

const ResetPassword = () => {
    const { id } = useParams();
    const [htmlContent, setHtmlContent] = useState('');
    const navigate = useNavigate();

    const fetchPage = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BE_HOST}/password/reset-password/${id}`);
            if (response.status === 404) {
                alert("Reset Password Request not found!");
                navigate("/forgot-password");
                return;
            }
            if (response.status === 401) {
                alert("Reset Password Request is already expired!");
                navigate("/forgot-password");
                return;
            }

            const data = await response.text();
            setHtmlContent(DOMPurify.sanitize(data));
        } catch (error) {
            console.error('Error fetching ResetPassword page:', error);
        }
    };

    useEffect(() => {
        fetchPage(id);
    }, [id]);

    useEffect(() => {
        const handlePasswordReset = async () => {
            const newPassword = document.getElementById('password').value;
            if (!newPassword) {
                alert('Please enter a new password.');
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_BE_HOST}/password/update-password/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ password: newPassword }),
                });

                const responseData = await response.json();

                if (response.ok) {
                    alert(responseData.message);
                    navigate("/auth");
                } else {
                    alert(responseData.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while resetting the password. Please try again later.');
            }
        };

        const btn = document.getElementById('btn');
        if (btn) {
            btn.addEventListener('click', handlePasswordReset);
        }

        return () => {
            if (btn) {
                btn.removeEventListener('click', handlePasswordReset);
            }
        };
    }, [htmlContent, id, navigate]);

    return (
        <div className='auth'>{ReactHtmlParser(htmlContent)}</div>
    );
};

export default ResetPassword;
