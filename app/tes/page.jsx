'use client'

import React from 'react'

const Page = () => {

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            
            const res = await fetch("http://localhost:5000/tiktok-tes", {
                method: "POST"
            });
            console.log(await res.json())

        } catch (err) {
            console.log(err.message)
        }
    };

    return (
        <div className='pt-20 h-dvh'>
            <p>page</p>
            {/* <form onSubmit={handleSubmit}>
                <input type="text" />
                <button type='submit'>submit</button>
            </form> */}
        </div>
    )
}

export default Page