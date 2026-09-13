'use client';
import {useState, useEffect} from 'react';

export default function Home(){
    const[status, setStatus]=useState('loading..');
    useEffect(()=>{
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
        .then((res)=>res.json())
        .then((data)=>setStatus(JSON.stringify(data)))
        .catch((err)=>setStatus('ERROR:' + err.message));
    },[]);
    return <div style={{ padding: 40, fontSize: 24 }}>Backend says: {status}</div>;

}