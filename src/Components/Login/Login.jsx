import React, { useState } from "react";
import "../../common.css";
import { postApi } from "../../Utils/Axios";
import { setDataInLocalStroge } from "../../Utils/Store";
import { Link } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.username.trim() !== "" && formData.password.trim() !== "") {
            setLoading(true);

            postApi(
                "https://bill-system-vtom.onrender.com/api/v1/user/login",
                {
                    username: formData.username,
                    password: formData.password
                }
            )
            .then(response => {
                // console.log(response.data);

                const { accessToken, refreshToken } = response.data;

                // Set tokens in local storage
                setDataInLocalStroge("userAccessToken", accessToken);
                setDataInLocalStroge("userRefreshToken", refreshToken);

                setFormData({
                    username: "",
                    password: ""
                });

                setApiError("");
                window.location.href = '/'; 
            })
            .catch(error => {
                if(error.response && error.response.status === 404) {
                    setApiError("Invalid username or email");
                }
                else if(error.response && error.response.status === 401) {
                    setApiError("Invalid password");
                }
                else {
                    setApiError("Invalid username or password");
                }
            })
            .finally(() => {
                setLoading(false);
            })
        } else {
            setApiError("Please fill in username and password fields");
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
        <div className="bg-[#f6f5f7] min-h-[100vh]">
            <div className="container mx-auto p-10">
                <div className="w-11/12 sm:w-2/3 lg:w-2/4 2xl:w-1/3 mx-auto p-6 md:p-10 my-10 bg-white form-box-shadow">
                    <h1 className="text-3xl font-bold text-center">Log In</h1>
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
                                Log In
                            </button>
                        </div>

                        <p className='text-center'>
                            Don't have an account? <Link to="/register"><span className='text-[#3498db]'>Register Now</span></Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;