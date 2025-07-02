import react from 'react';
import { useEffect, useState } from 'react';

export default function Header({page}) {
    return(
        <>
         <div className="relative h-[100px] w-full mb-6 outline-gray-400 outline rounded-lg ">
                        <img
                            src="https://i.pinimg.com/originals/1b/1b/b5/1b1bb5e2107b007bf4eb7b9eefb072ed.jpg"
                            alt="Server Deployments"
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center p-5">
                            <h1 className="text-4xl font-bold text-gray-200">
                                {page}
                            </h1>
                        </div>
                    </div>
    
        </>
    )

}