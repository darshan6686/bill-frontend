import React, { useState } from "react";
import "../../common.css";
import { postApi } from "../../Utils/Axios";
import { Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        errors: {
            username: "",
            email: "",
            password: ""
        }
    })

    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateUsername = () => {
        const noSpacePattern = /^\S+$/;
        if (!noSpacePattern.test(formData.username)) {
            setFormData((prevState) => ({
                ...prevState,
                errors: {
                    ...prevState.errors,
                    username: "Username cannot be empty or contain spaces."
                }
            }));
            return false;
        }
        setFormData((prevState) => ({
            ...prevState,
            errors: {
                ...prevState.errors,
                username: ""
            }
        }));
        return true;
    };

    const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            setFormData((prevState) => ({
                ...prevState,
                errors: {
                    ...prevState.errors,
                    email: "Please enter a valid email address."
                }
            }));
            return false;
        }
        setFormData((prevState) => ({
            ...prevState,
            errors: {
                ...prevState.errors,
                email: ""
            }
        }));
        return true;
    };

    const validatePassword = () => {
        if (formData.password.length < 6) {
            setFormData((prevState) => ({
                ...prevState,
                errors: {
                    ...prevState.errors,
                    password: "Password must be at least 6 characters long."
                }
            }));
            return false;
        }
        setFormData((prevState) => ({
            ...prevState,
            errors: {
                ...prevState.errors,
                password: ""
            }
        }));
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (isUsernameValid && isEmailValid && isPasswordValid) {
            setLoading(true)
            postApi(
                "https://bill-system-vtom.onrender.com/api/v1/user/register",
                {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }
            )
            .then(response => {
                console.log(response);

                // Clear form after successful registration
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    errors: {
                        username: "",
                        email: "",
                        password: ""
                    }
                });

                window.location.href = '/login'; 

                setApiError("");
            })
            .catch(error => {
                if (error.response && error.response.status == 409) {
                    setApiError("Username or email already exists.");
                } else {
                    setApiError("Username or email already exists.");
                }
            })
            .finally(() => {
                setLoading(false);
            })
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <>
            <div className="bg-[#f6f5f7] min-h-[100vh]">
                <div className="container mx-auto p-10">
                    <div className="w-11/12 sm:w-2/3 lg:w-2/4 2xl:w-1/3 mx-auto p-6 md:p-10 my-10 bg-white form-box-shadow">
                        <h1 className="text-3xl font-bold text-center">Register</h1>
                        <form className="flex flex-col gap-6 mt-10" onSubmit={handleSubmit}>

                            {/* Username Field */}
                            <div>
                                <p className="from-input-p">Username:</p>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Enter username"
                                    className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                                {formData.errors.username && (
                                    <p className="text-red-500 text-sm mt-1">{formData.errors.username}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <p className="from-input-p">Email:</p>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                    className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                {formData.errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{formData.errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <p className="from-input-p">Password:</p>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                {formData.errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{formData.errors.password}</p>
                                )}
                            </div>

                            {/* API Error Message */}
                            {apiError && (
                                <p className="text-red-500 text-center">{apiError}</p>
                            )}

                            { loading && (
                                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                                  <div
                                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current  border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status">
                                    <span
                                      className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0, 0)]"
                                    >Loading...</span>
                                  </div>
                                </div>
                              )}

                            {/* Submit Button */}
                            <div className="flex justify-center mt-3">
                                <button className="bg-[#3498db] text-white p-2 px-6 rounded-lg hover:bg-[#2980b9]" type="submit">
                                    Register
                                </button>
                            </div>

                            <p className='text-center'>Already have an account? <Link to="/login"><span className='text-[#3498db]'>Log in</span></Link> </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;