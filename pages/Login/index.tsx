import useInput from '@hooks/useInput'
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Link, Navigate, redirect, Route, Routes } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';



const LogIn:FC = () => {

  const {data,error,mutate}:any = useSWR("http://localhost:3095/api/users",fetcher,);   //url을 fetcher로 넘겨준다
    const [logInError, setLogInError] = useState(false);
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');
    const onSubmit = useCallback(
      (e:any) => {
          e.preventDefault();
          setLogInError(false);
          axios
            .post(
              'http://localhost:3095/api/users/login',
              { email, password },{
                withCredentials: true,    //서로 다른 포트를 가진 url간 쿠키 공유
              }
            )
            .then((response) => {
              mutate(response.data,false);

            })
            .catch((error) => {
                console.dir(error);
                setLogInError(error.response?.status === 401);
            });
      },
      [email, password],
    );

    if(data === undefined){
        return <div>로딩중...</div>;
    }

  if(data) {
    console.log("go Work");
    return (
      // <Routes>
      //   <Route path="/" element={<Navigate replace to="/workspace/channel"/>}/>
      // </Routes>

      <Navigate to="/workspace/sleact/channel/일반"></Navigate>
    )
  }


    return (
      <div id="container">
          <Header>Sleact</Header>
          <Form onSubmit={onSubmit}>
              <Label id="email-label">
                  <span>이메일 주소</span>
                  <div>
                      <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
                  </div>
              </Label>
              <Label id="password-label">
                  <span>비밀번호</span>
                  <div>
                      <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
                  </div>
                  {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
              </Label>
              <Button type="submit">로그인</Button>
          </Form>
          <LinkContainer>
              아직 회원이 아니신가요?&nbsp;
              <Link to="/signup">회원가입 하러가기</Link>
          </LinkContainer>
      </div>
    );
};

export default LogIn;