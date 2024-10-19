import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getApi } from '../../Utils/Axios'
import { getDataFromLocalStroge } from '../../Utils/Store'
import { formatDate } from '../../Utils/Formate.jsx'

const BillDetails = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const { billId } = useParams()

    useEffect(() => {
        let isMounted = true;
        const token = getDataFromLocalStroge("userAccessToken")
    
        if (token) {
          setLoading(true);
            getApi(
                `https://bill-system-vtom.onrender.com/api/v1/bill/b/${billId}`,
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
            .finally(() => {
              if (isMounted) {
                setLoading(false);
              }
            })
        }
    
        return () => {
            isMounted = false;
          };
    }, [])

  return (
    <>
        <div className='container mx-auto mt-28'>

        { loading && (
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

            <div>
                { !loading && data.map((item) => {
                    return (
                        <div key={item._id} className="p-7 text-lg border border-black">
                            <p><strong className='pr-4'>Name: </strong> {item.deellarId.name} </p>
                            <p><strong className='pr-4'>Bill Number:</strong> {item.billNumber} </p>
                            <p><strong className='pr-4'>Product Name:</strong> {item.name} </p>
                            <p><strong className='pr-4'>Date:</strong> {formatDate(item.date)} </p>
                            <p><strong className='pr-4'>Type:</strong> {item.billType} </p>
                        </div>
                    )
                }) }
                <div className='border border-black p-7 mt-1 space-y-2 min-h-40'>
                    <div className='flex font-bold text-lg mb-5'>
                        <p className='w-3/5'>Name</p>
                        <p className='w-1/5'>Part Number</p>
                        <p className='w-1/5'>Item Number</p>
                        <p className='w-1/5'>Amount</p>
                        <p className='w-1/5'>Total Amount</p>
                    </div>
                    { !loading && data.map((item) => {
                        return (
                            <div key={item._id} className='flex'>
                                <p className='w-3/5'>{item.name}</p>
                                <p className='w-1/5'>{item.partNumber}</p>
                                <p className='w-1/5'>{item.itemNumber}</p>
                                <p className='w-1/5'>{item.amount}</p>
                                <p className='w-1/5'>{item.itemNumber * item.amount}</p>
                            </div>
                        )
                    })}
                </div>
                { !loading && data.map((item) => {
                    return (
                        <div key={item._id} className='border border-black mt-1 py-2 px-7 text-right font-bold text-lg'>
                            <p>Total Amount: {item.itemNumber * item.amount}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    </>
  )
}

export default BillDetails
