import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import useSWR from 'swr';
import { jsx } from '@emotion/react';
import {Navigate} from "react-router-dom";


type BoxProps = {
  children:React.ReactNode;
}
const Workspace = ({children}:BoxProps) =>{
  const {data,error,revalidate}:any = useSWR("http://localhost:3095/api/users",fetcher,);

  const onLogout = useCallback(()=> {
    axios.post('http://localhost:3095/api/users/logout',null, {
      withCredentials: true,
    })
      .then(()=>{
        revalidate();
      });
  },[]);

  if(!data){
      return (<Navigate to ="/login"></Navigate>)
  }

  return(
    <div>
      <button onClick={onLogout}>
        로그아웃
      </button>
      {children}
    </div>
  )
}




export default Workspace;