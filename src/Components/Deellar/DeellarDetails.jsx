import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDataFromLocalStroge } from '../../Utils/Store'
import { deleteApi, getApi, patchApi, postApi } from '../../Utils/Axios'
import { formatDate } from '../../Utils/Formate'

const DeellarDetails = () => {
    const [formData, setFormData] = useState({
        billNumber: "",
        name: "",
        partNumber: "",
        date: "",
        billType: "",
        itemNumber: "",
        amount: "",
        image: null
    })
    const [data, setData] = useState([])
    const [billData, setBillData] = useState([])
    const { dealerId } = useParams()
    const [activeModal, setActiveModal] = useState(null)
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)
    const [billId, setBillId] = useState(null)
    const [search, setSearch] = useState("")


    const openModal = (modalType, bill = null) => {
        setActiveModal(modalType);

        if (modalType === 'edit' && bill) {
          setBillId(bill._id)
          setFormData({
            billNumber: bill.billNumber,
            name: bill.name,
            partNumber: bill.partNumber,
            date: bill.date,
            billType: bill.billType,
            itemNumber: bill.itemNumber,
            amount: bill.amount,
            image: ""
          });
        } else {
          setBillId(null)
          setFormData({
            billNumber: "",
            name: "",
            partNumber: "",
            date: "",
            billType: "",
            itemNumber: "",
            amount: "",
            image: ""
          });
        }
    };
  
    const closeModal = () => {
        setActiveModal(null)
        setErrorMessage("")
        setFormData({
            billNumber: "",
            name: "",
            partNumber: "",
            date: "",
            billType: "",
            itemNumber: "",
            amount: "",
            image: ""
        })
    }

    useEffect(() => {
        let isMounted = true; // Create a flag to track if the component is still mounted
        const token = getDataFromLocalStroge("userAccessToken")

        if (token) {
            getApi(
                `https://bill-system-vtom.onrender.com/api/v1/deellar/d/${dealerId}`,
                {
                    Authorization: `Bearer ${token}`,
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
        }

        return () => {
            isMounted = false; // Cleanup the flag when the component unmounts
          };
    },[])


    const addBill = (e) => {
      e.preventDefault();
      const token = getDataFromLocalStroge("userAccessToken");
    
      if (token) {
        setLoading(true);
    
        const formBody = new FormData(); // Use a different variable name
        formBody.append('billNumber', formData.billNumber); // formData refers to the state
        formBody.append('name', formData.name);
        formBody.append('partNumber', formData.partNumber);
        formBody.append('date', formData.date);
        formBody.append('billType', formData.billType);
        formBody.append('itemNumber', formData.itemNumber);
        formBody.append('amount', formData.amount);
        formBody.append('image', formData.image);  // Append the image file
    
        postApi(
          `https://bill-system-vtom.onrender.com/api/v1/bill/add-bill/${dealerId}`,
          formBody,  
          {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        )
        .then((response) => {
          // console.log(response.data);

          setErrorMessage("");
          closeModal();

          window.location.reload()
        })
        .catch((error) => {
          console.log(error);
    
          if (error.response && error.response.status == 409) {
            setErrorMessage("Bill is already added");
          } else if (error.response && error.response.status == 404) {
            setErrorMessage("Invalid Dealer");
          } else if (error.response && error.response.status == 400) {
            setErrorMessage("Product stock or bill image is invalid");
          }
        })
        .finally(() => {
          setLoading(false);
        });
      } else {
        setErrorMessage("Please login");
      }
    };
    

  
  useEffect(() => {
    let isMounted = true; // Create a flag to track if the component is still mounted
    const token = getDataFromLocalStroge("userAccessToken")

    if (token) {
      setDataLoading(true);
        getApi(
            `https://bill-system-vtom.onrender.com/api/v1/bill/${dealerId}`,
            {
                Authorization: `Bearer ${token}`,
            }
        )
        .then((response) => {
            if (isMounted) {
                // console.log(response.data);
                setBillData(response.data);
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
        })
    }

    return () => {
        isMounted = false;
      };
  },[])


  const updateBill = (billId, e) => {
    e.preventDefault();
    const token = getDataFromLocalStroge("userAccessToken")

    if (token) {
      setLoading(true)
      patchApi(
        `https://bill-system-vtom.onrender.com/api/v1/bill/update-bill/${billId}`,
        {
          billNumber: formData.billNumber,
          name: formData.name,
          partNumber: formData.partNumber,
          date: formData.date,
          itemNumber: formData.itemNumber,
          amount: formData.amount
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
          setErrorMessage("Stock is not available. Please add more stock")
        }
      })
      .finally(() => {
        setLoading(false)
      })
      
    } else {
      window.location.href = '/login'; 
    }
  }

    const deleteBill = (billId) => {
      const token = getDataFromLocalStroge("userAccessToken")

      if (token) {
        setDataLoading(true)
        deleteApi(
          `https://bill-system-vtom.onrender.com/api/v1/bill/delete-bill/${billId}`,
          {
            Authorization: `Bearer ${token}`,
          }
        )
        .then((response) => {
          // console.log(response.data);
          setErrorMessage("")

          window.location.reload()
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setDataLoading(false);
        })

      } else {
        setErrorMessage("You are not login")
      }
    }


    const searchBill = (dealerId) => {
      const token = getDataFromLocalStroge("userAccessToken")

      if (token) {
        setDataLoading(true)

        postApi(
          `https://bill-system-vtom.onrender.com/api/v1/bill/search-bill/${dealerId}`,
          {
            search
          },
          {
            Authorization: `Bearer ${token}`
          }
        )
        .then((response) => {
          // console.log(response.data);
          setBillData(response.data)
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setDataLoading(false);
        })
      }

    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
      setFormData({
        ...formData,
        image: e.target.files[0],  // Set the image file from the file input
      });
    };
    
      
  return (
    <>
    <div className="container mx-auto mt-28">
        {data && data.map((item) => {
            return (
                <div key={item._id} className="p-7 text-lg border border-black">
                <p><strong className='pr-4'>Name:</strong> {item.name}</p>
                    <p><strong className='pr-4'>Stock:</strong> {item.stock}</p>
                    <p><strong className='pr-4'>GST Number:</strong> {item.gstNumber}</p>
                    <p><strong className='pr-4'>Bank Name:</strong> {item.bankName}</p>
                    <p><strong className='pr-4'>Account Number:</strong> {item.accountNumber}</p>
                    <p><strong className='pr-4'>IFSC Code:</strong> {item.ifscCode}</p>
                </div>
            )
        })}

        <div className="flex justify-end pt-10">
            <button className="bg-[#3498db] text-white p-2 px-6 rounded-lg hover:bg-[#2980b9]" type="submit" onClick={() =>     {openModal("add")}}>
                Add Bill
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
              <button className='border border-black p-3 rounded-lg' onClick={() => searchBill(dealerId)}>Search</button>
        </div>

        <div className='border border-black p-5 mt-10 pt-5 space-y-3'>
            <div className='flex font-bold xl:text-lg mb-10'>
              <p className='w-1/12'>Bill No.</p>
              <p className='w-4/12'>Name</p>
              <p className='w-1/12'>Part No.</p>
              <p className='w-2/12'>Date</p>
              <p className='w-1/12'>Bill Type</p>
              <p className='w-1/12'>Day</p>
              <p className='w-1/12'>Item No.</p>
              <p className='w-1/12'>Amount</p>
              <p className='w-1/12'>Total</p>
              <p className='w-1/12'></p>
            </div>

          { !dataLoading && billData.map((billItem) => {
            return (
              <div key={billItem._id} className='flex mb-5 space-y-2'>
                <Link className='flex justify-between w-full' to={`/bill/${billItem._id}`}>
                  <p className='w-1/12 truncate'>{billItem.billNumber}</p>
                  <p className='w-4/12 truncate'>{billItem.name}</p>
                  <p className='w-1/12 truncate'>{billItem.partNumber}</p>
                  <p className='w-2/12 truncate'>{formatDate(billItem.date)}</p>
                  <p className='w-1/12 truncate'>{billItem.billType}</p>
                  <p className='w-1/12 truncate'>{billItem.day}</p>
                  <p className='w-1/12 truncate'>{billItem.itemNumber}</p>
                  <p className='w-1/12 truncate'>{billItem.amount}</p>
                  <p className='w-1/12 truncate'>{billItem.totalAmount}</p>
                </Link>
                <p className='flex justify-around w-1/12'>
                  <span className='mx-5 cursor-pointer' onClick={() => openModal("edit", billItem)}>
                    <i className="fa-regular fa-pen-to-square"></i>
                  </span>
                  <span className='cursor-pointer' onClick={() => deleteBill(billItem._id)}>
                    <i className="fa-solid fa-trash"></i>
                  </span>
                </p>
            </div>        
            )
          })}
        </div>
    </div>

    {activeModal === 'add' && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black opacity-50 absolute inset-0"></div>
          <div className="bg-white w-2/3 lg:w-1/3 max-h-screen overflow-y-auto rounded-lg p-5 sm:p-8 z-10">
            <h2 className="text-lg font-semibold mb-4">Add Bill</h2>
            <form onSubmit={addBill} type="multipart/form-data">

              <div className="mb-4">
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="name">
                  Bill Number
                </label>
                <input
                  type="text"
                  name="billNumber"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                  placeholder="Enter bill number"
                  value={formData.billNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="stock">
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
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="gstNumber">
                  Part Number
                </label>
                <input
                  type="text"
                  name="partNumber"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                  placeholder="Enter part number"
                  value={formData.partNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="bankName">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                  placeholder="Enter date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="billType">
                  Bill Type
                </label>
                <input
                  type="radio"
                  name="billType"
                  value="sell"
                  checked={formData.billType === 'sell'}  // Check if the value matches
                  onChange={handleInputChange}
                />
                <label className='ml-1' htmlFor="sell">sell</label>
                <input
                  className='ml-5'
                  type="radio"
                  name="billType"
                  value="purchase"
                  checked={formData.billType === 'purchase'}  // Check if the value matches
                  onChange={handleInputChange}
                />
                <label className='ml-1' htmlFor="purchase">purchase</label><br/>
            </div>


              <div className="mb-4">
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="ifscCode">
                  Item Number
                </label>
                <input
                  type="number"
                  name="itemNumber"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                  placeholder="Enter item number"
                  value={formData.itemNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="ifscCode">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="ifscCode">
                 Bill Image
                </label>
                <input
                  type="file"
                  name="image"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                  onChange={handleImageChange}
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
            <h2 className="text-lg font-semibold mb-4">Edit Bill</h2>
            <form onSubmit={(e) => updateBill(billId, e)}>

              <div className="mb-4">
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="billNumber">
                  Bill Number
                </label>
                <input
                  type="text"
                  name="billNumber"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                  value={formData.billNumber}
                  onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
                  required
                />
              </div>

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
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="partNumber">
                  Part Number
                </label>
                <input
                  type="text"
                  name="partNumber"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                  value={formData.partNumber}
                  onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="date">
                  Date
                </label>
                <input
                  type="date"
                  name="bankName"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                  value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="itemNumber">
                  Item Number
                </label>
                <input
                  type="number"
                  name="itemNumber"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                  value={formData.itemNumber}
                  onChange={(e) => setFormData({ ...formData, itemNumber: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 sm:text-lg font-bold mb-2" htmlFor="amount">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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

export default DeellarDetails
