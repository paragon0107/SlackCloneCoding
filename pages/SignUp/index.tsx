import React, { useCallback, useState } from 'react';
import {Form, Error, Label, Input, LinkContainer, Button, Header, Success} from './styles';
import axios from 'axios';
import useInput from "@hooks/useInput";
import {Link, Navigate} from "react-router-dom";
import useSWR from "swr";
import fetcher from "@utils/fetcher";

const SignUp = () => {
    const {data,error,mutate}:any = useSWR("http://localhost:3095/api/users",fetcher,);

    const[email,onChangeEmail] = useInput('');
    const[nickname,onChangeNickname] = useInput('');
    const[password,setPassword] = useState('');
    const[passwordCheck,setPasswordCheck] = useState('');
    const [mismatchError, setMismatchError] = useState(false);
    const [signUpError, setSignUpError] = useState("");
    const [signUpSuccess, setSignUpSuccess] = useState(false);


    const onChangePassword = useCallback((event:any)=>{
        setPassword(event.target.value);
        setMismatchError(event.target.value !== password);
    },[passwordCheck]);//패스워드 쳌이 바뀔때 같은지 다른지 확인할거니까?

    const onChangePasswordCheck = useCallback((event:any)=>{
        setPasswordCheck(event.target.value);
        setMismatchError(event.target.value !== password);
    },[password]);//패스워드가 바뀔때 확인하니까?

    const onSubmit = useCallback((event:any)=>{
        event.preventDefault();
        setSignUpError("");//비동기에서 state를 설정할때 이렇게 한번씩 초기화 해주고 사용해야
        setSignUpSuccess(false);//  전에 사용하던 스테이트를 그대로 사용하는것을 방지할 수 있다

        if(!mismatchError && nickname){
            console.log("서버로 회원가입!")
            axios.post("http://localhost:3095/api/users",{
                email,
                nickname,
                password,
            })
                .then((response:any)=>{
                    console.log(response);
                    setSignUpSuccess(true);
                })
                .catch((error:any)=>{
                    console.log(error.response);
                    setSignUpError(error.response.data);
                })
                .finally(()=>{})

        }
    },[email,nickname,password,password,mismatchError]);

    if(data){
        return (<Navigate to ="/login"></Navigate>)
    }

    // const { data: userData } = useSWR('/api/users', fetcher);
    // const [signUpError, setSignUpError] = useState(false);
    // const [signUpSuccess, setSignUpSuccess] = useState(false);
    // const [mismatchError, setMismatchError] = useState(false);
    // const [email, onChangeEmail] = useInput('');
    // const [nickname, onChangeNickname] = useInput('');
    // const [password, , setPassword] = useInput('');
    // const [passwordCheck, , setPasswordCheck] = useInput('');
  
    // const onChangePassword = useCallback(
    //   (e) => {
    //     setPassword(e.target.value);
    //     setMismatchError(passwordCheck !== e.target.value);
    //   },
    //   [passwordCheck],
    // );
  
    // const onChangePasswordCheck = useCallback(
    //   (e) => {
    //     setPasswordCheck(e.target.value);
    //     setMismatchError(password !== e.target.value);
    //   },
    //   [password],
    // );
  
    // const onSubmit = useCallback(
    //   (e) => {
    //     e.preventDefault();
    //     if (!nickname || !nickname.trim()) {
    //       return;
    //     }
    //     if (!mismatchError) {
    //       setSignUpError(false);
    //       setSignUpSuccess(false);
    //       axios
    //         .post('/api/users', { email, nickname, password })
    //         .then(() => {
    //           setSignUpSuccess(true);
    //         })
    //         .catch((error) => {
    //           setSignUpError(error.response?.data?.statusCode === 403);
    //         });
    //     }
    //   },
    //   [email, nickname, password, mismatchError],
    // );
  
    // if (userData) {
    //   return <Redirect to="/workspace/sleact" />;
    // }
  
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
          <Label id="nickname-label">
            <span>닉네임</span>
            <div>
              <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
            </div>
          </Label>
          <Label id="password-label">
            <span>비밀번호</span>
            <div>
              <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
            </div>
          </Label>
          <Label id="password-check-label">
            <span>비밀번호 확인</span>
            <div>
              <Input
                type="password"
                id="password-check"
                name="password-check"
                value={passwordCheck}
                onChange={onChangePasswordCheck}
              />
            </div>
             {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
            {!nickname && <Error>닉네임을 입력해주세요.</Error>}
            {signUpError && <Error>{signUpError}</Error>}
            {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
          </Label>
          <Button type="submit">회원가입</Button>
        </Form>
        <LinkContainer>
          이미 회원이신가요?&nbsp;
          <Link to="/login">로그인 하러가기</Link>
        </LinkContainer>
      </div>
    );
  };
  
  export default SignUp;