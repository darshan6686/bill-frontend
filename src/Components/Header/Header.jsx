import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteApi, getApi, patchApi } from '../../Utils/Axios';
import { getDataFromLocalStroge, removeLocalStorage } from '../../Utils/Store.jsx';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null); 
    const [username, setUsername] = useState("")
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        oldPassword: "",
        newPassword: ""
    })

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const openModal = (modalType) => {
        setActiveModal(modalType);
        setIsDropdownOpen(false); 
    };

    const closeModal = () => {
        setFormData({
          username: "",
          oldPassword: "",
          newPassword: ""
        })
        setErrorMessage("")
        setActiveModal(null);
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
          ...prevState,
          [name]: value
      }));
  };
    

    useEffect(() => {
      const fetchUser = () => {
        const token = getDataFromLocalStroge("userAccessToken");

        if (token) {
          setLoading(true)
            getApi(
              "https://bill-system-vtom.onrender.com/api/v1/user/profile",
              {
                Authorization: `Bearer ${token}`
              }
            )
            .then((response) => {
                // console.log(response.data);
                setUsername(response.data.username)
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false)
            })
        }
    };
    
        fetchUser();
    }, [])


    const logout = () => {
      const accessToken = getDataFromLocalStroge("userAccessToken");  

      if (accessToken) {
            setLoading(true)        
          deleteApi("https://bill-system-vtom.onrender.com/api/v1/user/logout", {
              Authorization: `Bearer ${accessToken}`,
          })
          .then((response) => {
              // console.log("Logout successful", response);  
              removeLocalStorage("userAccessToken")
              removeLocalStorage("userRefreshToken")  
              window.location.href = '/login'; 
          })
          .catch((error) => {
              console.log("Logout error", error);
          })
          .finally(() => {
            setLoading(false)
          })
      }
      else {
        console.log("No access token found");
      }
    }


    const changeUsername = (e) => {
        e.preventDefault();
        const accessToken = getDataFromLocalStroge("userAccessToken");

        if (accessToken) {
          setLoading(true)
          patchApi(
            "https://bill-system-vtom.onrender.com/api/v1/user/change-username",
            {
                username: formData.username
            },
            {
                Authorization: `Bearer ${accessToken}`
            }
          )
          .then((response) => {
            // console.log(response.data);

            setFormData({
              username: response.data.username
            })

            setErrorMessage("")
            closeModal()
          })
          .catch((error) => {
            console.log(error);

            if (error.response && error.response.status == 409) {
              setErrorMessage("username is not availabel")
            }
            else {
              setErrorMessage("failed to change username")
            }
          })
          .finally(() => {
            setLoading(false)
          })
        }
        else {
          console.log("No access token found");
        }
      }


    const changePassword = (e) => {
      e.preventDefault()
      const accessToken = getDataFromLocalStroge("userAccessToken");

      if (accessToken) {
        setLoading(true)
        patchApi(
          "https://bill-system-vtom.onrender.com/api/v1/user/change-password",
          {
              oldPassword: formData.oldPassword,
              newPassword: formData.newPassword
          },
          {
            Authorization: `Bearer ${accessToken}`
          }
        )
        .then((response) => {
          // console.log(response.data);

          setFormData({
            oldPassword: "",
            newPassword: ""
          })

          setErrorMessage("")
          closeModal()
        
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status == 400) {
            setErrorMessage("both field is required")
          }
          else if(error.response && error.response.status == 409){
            setErrorMessage("Invalid old password")
          }
          else {
            setErrorMessage("failed to change password")
          }
        })
        .finally(() => {
          setLoading(false)
        })
      }
      else {
        console.log("token not found");
      }
    }
  

  return (
    <>
      <header className="bg-gray-800 w-full p-4 fixed top-0">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/"><h1 className="text-white text-2xl font-bold">MyApp</h1></Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
              </li>
              <li>
                <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
              </li>

              <li className="relative">
                <button
                  onClick={toggleDropdown}
                  className="text-white hover:text-gray-300 focus:outline-none"
                >
                  {username}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded shadow-lg">
                    <ul className="py-2">
                      <li>
                        <p
                          onClick={() => openModal('changeUsername')}
                          className="block px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                        >
                          Change Username
                        </p>
                      </li>
                      <li>
                        <p
                          onClick={() => openModal('changePassword')}
                          className="block px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                        >
                          Change Password
                        </p>
                      </li>
                      <li>
                        <p
                          className="block px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                          onClick={logout}
                        >
                          Logout
                        </p>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Modal for Change Username */}
      {activeModal === 'changeUsername' && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black opacity-50 absolute inset-0"></div>
          <div className="bg-white w-2/3 lg:w-1/3 rounded-lg p-5 sm:p-8 z-10">
            <h2 className="text-lg font-semibold mb-4">Change Username</h2>
            <form onSubmit={changeUsername}>
              <div className="mb-4">
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="username">
                  New Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                  placeholder="Enter new username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              { errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}

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

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white  px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Change Password */}
      {activeModal === 'changePassword' && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black opacity-50 absolute inset-0"></div>
          <div className="bg-white w-2/3 lg:w-1/3 rounded-lg p-5 sm:p-8 z-10">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <form onSubmit={changePassword}>
              <div className="mb-4">
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="password">
                  Old Password
                </label>
                <input
                  name="oldPassword"
                  id="password"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                  placeholder="Enter Old password"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="password">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              { errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}

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

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </>
  );
};

export default Header;
