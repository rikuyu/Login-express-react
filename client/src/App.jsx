import React, { useState, useEffect } from "react";
import "./App.css";
import Axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginName, setLoginName] = useState("");
  const [loginPassWord, setLoginPassword] = useState("");

  const [loginResult, setLoginResult] = useState("");

  Axios.defaults.withCredentials = true;

  const handleRegister = () => {
    Axios.post("http://localhost:3001/register", {
      username: username,
      password: password,
    }).then((response) => {
      console.log(response);
    });
  };

  const handleLogin = () => {
    Axios.post("http://localhost:3001/login", {
      username: loginName,
      password: loginPassWord,
    }).then((response) => {
      console.log(response);
      if (response.data.message) {
        setLoginResult(response.data.message);
        console.log(response.data.message);
      } else {
        setLoginResult("ログイン成功");
        console.log(response.data.message);
      }
    });
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      console.log(response);
      if (response.data.loggedIn === true) {
        setLoginResult(`${response.data.user[0].username} でログイン中`);
      }
    });
  }, []);

  return (
    <div className="App">
      <div className="register">
        <h1>登録</h1>
        <label>ユーザーネーム</label>
        <input
          type="text"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <br />
        <label>パスワード</label>
        <input
          type="text"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <br />
        <button onClick={handleRegister}>登録</button>
      </div>
      <div className="login">
        <h1>ログイン</h1>
        <input
          type="text"
          placeholder="ユーザーネーム"
          onChange={(e) => {
            setLoginName(e.target.value);
          }}
        />
        <br />
        <input
          type="password"
          placeholder="パスワード"
          onChange={(e) => {
            setLoginPassword(e.target.value);
          }}
        />
        <br />
        <button onClick={handleLogin}>ログイン</button>
      </div>
      <h1>{loginResult}</h1>
    </div>
  );
}

export default App;
