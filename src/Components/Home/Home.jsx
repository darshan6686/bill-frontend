import React, { useEffect, useState } from 'react'
import { getDataFromLocalStroge } from '../../Utils/Store'
import { deleteApi, getApi, patchApi, postApi } from '../../Utils/Axios'
import { Link } from 'react-router-dom'

const Home = () => {
    const [formData, setFormData] = useState({
      name: "",
      stock: "",
      gstNumber: "",
      bankName: "",
      accountNumber: "",
      ifscCode: ""
    })
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)
    const [activeModal, setActiveModal] = useState(null)
    const [errorMessage, setErrorMessage] = useState("");
    const [dellarId, setDellarId] = useState(null)
    const [search, setSearch] = useState("")


    const openModal = (modalType, dealer = null) => {
      setActiveModal(modalType);
      
      if (modalType === 'edit' && dealer) {
        setDellarId(dealer._id)
        setFormData({
          name: dealer.name,
          stock: dealer.stock,
          gstNumber: dealer.gstNumber,
          bankName: dealer.bankName,
          accountNumber: dealer.accountNumber,
          ifscCode: dealer.ifscCode
        });
      } else {
        setDellarId(null)
        setFormData({
          name: "",
          stock: "",
          gstNumber: "",
          bankName: "",
          accountNumber: "",
          ifscCode: ""
        });
      }
    };
    

    const closeModal = () => {
        setActiveModal(null)
        setErrorMessage("")
        setFormData({
          name: "",
          stock: "",
          gstNumber: "",
          bankName: "",
          accountNumber: "",
          ifscCode: ""
        })
    }


    useEffect(() => {
      let isMounted = true; // Create a flag to track if the component is still mounted
    
      const fetchDeellar = () => {
        const token = getDataFromLocalStroge("userAccessToken");
    
        if (token) {
          setDataLoading(true);
    
          getApi(
            "https://bill-system-vtom.onrender.com/api/v1/deellar",
            {
              Authorization: `Bearer ${token}`
            }
          )
          .then((response) => {
            if (isMounted) {
              // console.log(response.data);
              setData(response.data);
            }
          })
          .catch((error) => {
            if (isMounted) {
              console.log(error);
            }
          })
          .finally(() => {
            if (isMounted) {
              setDataLoading(false);
            }
          });
        }
        else {
          window.location.href = '/login'; 
        }
      };
    
      fetchDeellar();
    
      return () => {
        isMounted = false; // Cleanup the flag when the component unmounts
      };
    }, []);
    

    const searchDeellar = () => {
      const token = getDataFromLocalStroge("userAccessToken");

      if (token) {
        setDataLoading(true);

        postApi("https://bill-system-vtom.onrender.com/api/v1/deellar/search-deellar", 
          { 
            search
          }, 
          {
            Authorization: `Bearer ${token}`
          }
        )
        .then((response) => {
          // console.log(response.data);
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setDataLoading(false);
        });
        
      } else {
        window.location.href = '/login';
      }
    };



    const addPerson = (e) => {
      e.preventDefault();
      const token = getDataFromLocalStroge("userAccessToken")

      if (token) {
        setLoading(true)

        postApi(
          "https://bill-system-vtom.onrender.com/api/v1/deellar/add-deellar",
          {
            name: formData.name,
            stock: formData.stock,
            gstNumber: formData.gstNumber,
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode
          },
          {
            Authorization: `Bearer ${token}`
          }
        )
        .then((response) => {
          // console.log(response.data);

          setErrorMessage("")
          closeModal()
        })
        .catch((error) => {
          if (error.response && error.response.status == 400 ) {
            setErrorMessage("Please fill all deellar details")
          }
          else if (error.response && error.response.status == 404 ){
            setErrorMessage("something went to wrong add deellar")
          }
        })
        .finally(() => {
          setLoading(false)
        })
      }
      else {
        setErrorMessage("Please login")
      }
    }


    const updateDeellar = (deellarId, e) => {
      e.preventDefault();
      const token = getDataFromLocalStroge("userAccessToken")

      if (token) {
        setLoading(true)

        patchApi(
          `https://bill-system-vtom.onrender.com/api/v1/deellar/update-deellar/${deellarId}`,
          {
            name: formData.name,
            stock: formData.stock,
            gstNumber: formData.gstNumber,
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode
          },
          {
            Authorization: `Bearer ${token}`
          }
        )
        .then((response) => {
          // console.log(response.data);

          setErrorMessage("")
          closeModal()
          window.location.reload()
          
        })
        .catch((error) => {
          console.log(error);

          if (error.response && error.response.status == 400) {
            setErrorMessage("Please fill all deellar field")
          }
          else if (error.response && error.response.status == 404) {
            setErrorMessage("Something went to wrong update deellar")
          }

        })
        .finally(() => {
          setLoading(false)
        })
      } else {
        setErrorMessage("Please login")
      }
    }


    const deleteDeellar = (deellarId) => {
      const token = getDataFromLocalStroge("userAccessToken")

      if (token) {
        setLoading(true)
        deleteApi(
          `https://bill-system-vtom.onrender.com/api/v1/deellar/delete-deellar/${deellarId}`,
          {
            Authorization: `Bearer ${token}`
          }
        )
        .then((response) => {
          // console.log(response);

          setErrorMessage("")
          window.location.reload()
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false)
        })
      }
      else {
        setErrorMessage("Please login")
      }
    }

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
          ...prevState,
          [name]: value
      }));
  };

  return (
    <>
        <div className='container mx-auto mt-28'>
            <div className="flex justify-end pt-5">
                <button className="bg-[#3498db] text-white p-2 px-6 rounded-lg hover:bg-[#2980b9]" type="submit" onClick={() =>  {openModal("add")}}>
                    Add
                </button>
            </div>

            <div className='my-10 flex'>
              <input
              type="search"
              name="search"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className="w-full p-2 px-4 rounded-lg border border-black focus:outline-none"
              />
              <button className='border border-black p-3 rounded-lg' onClick={searchDeellar}>Search</button>
            </div>

            <div className='mt-12 space-y-2'>
                { dataLoading && (
                  <div className='flex justify-center'>
                  
                  <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status">
                      <span
                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                      >Loading...</span>
                  </div>
                  </div>
                )}
                { !dataLoading && data.map((item) => {
                  return (
                    <div key={item._id} className='flex border border-black rounded-lg p-3 relative'>
                    <Link className='flex w-full' to={`/dealer/${item._id}`}>
                      <div className='w-1/3 truncate'>
                        {item.name}
                      </div>
                      <div className='w-1/3 truncate'>
                        {item.stock}
                      </div>
                    </Link>
                      <div className='w-1/3 text-right'>
                        <span className='mx-5 cursor-pointer' onClick={() => openModal("edit", item)}>
                          <i className="fa-regular fa-pen-to-square"></i>
                        </span>
                        <span className='cursor-pointer' onClick={() => deleteDeellar(item._id)}>
                          <i className="fa-solid fa-trash"></i>
                        </span>
                      </div>
                    </div>
                  )
                }) }

            </div>
            
        </div>

        {activeModal === 'add' && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-black opacity-50 absolute inset-0"></div>
              <div className="bg-white w-2/3 lg:w-1/3 max-h-screen overflow-y-auto rounded-lg p-5 sm:p-8 z-10">
                <h2 className="text-lg font-semibold mb-4">Add Person</h2>
                <form onSubmit={addPerson}>

                  <div className="mb-4">
                    <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="stock">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                      placeholder="Enter stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="gstNumber">
                      Gst Number
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                      placeholder="Enter gst number"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="bankName">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                      placeholder="Enter bank name"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="accountNumber">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                      placeholder="Enter account number"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="ifscCode">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                      placeholder="Enter ifscCode"
                      value={formData.ifscCode}
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
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {activeModal === 'edit' && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-black opacity-50 absolute inset-0"></div>
              <div className="bg-white w-2/3 lg:w-1/3 max-h-screen overflow-y-auto rounded-lg p-5 sm:p-8 z-10">
                <h2 className="text-lg font-semibold mb-4">Update Person</h2>
                <form onSubmit={(e) => updateDeellar(dellarId, e)}>

                  <div className="mb-4">
                    <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="stock">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="gstNumber">
                      Gst Number
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="bankName">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="accountNumber">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="ifscCode">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
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
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

    </>
  )
}

export default Home
