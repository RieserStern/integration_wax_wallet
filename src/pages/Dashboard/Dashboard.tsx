
import { useState, useEffect } from "react";
import * as waxjs from "@waxio/waxjs/dist";
import { Grid, Box, Button } from '@mui/material';
import "./Dashboard.css";
import { useNavigate, Router } from "react-router-dom";
import { useParams } from "react-router-dom";
import AnchorLink from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'



export const Dashboard = () => {

  const queryParams = new URLSearchParams(window.location.search);
  const playfabID = queryParams.get("playfabID");
  console.log(playfabID);

  const [loginFlag, setLogin] = useState(true);
  const [idCode, setIdcode] = useState("");
  const playid = useParams();

  const [walletAddress, setWalletAddress] = useState("");
  const endpoint = "https://9ce70.playfabapi.com/Server/ExecuteCloudScript";
  let wallet_userAccount = "";
  let display_nft = false;
  let loggedIn = false;
  const schema = "soldiers";
  const wax = new waxjs.WaxJS({
    rpcEndpoint: endpoint
  });
  let d: any;
  useEffect(() => {
    
    if(playfabID != null && playfabID != undefined){
      setIdcode(playfabID);
    }
  }, [playfabID, playid])



  const identifier = 'Crowd'
  // initialize the browser transport
  const transport = new AnchorLinkBrowserTransport();

  const link = new AnchorLink({
    transport,
    chains: [{
      chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
      nodeUrl: 'https://wax.greymass.com',
    }]
  })
  // the session instance, either restored using link.restoreSession() or created with link.login()
  let session;

  // tries to restore session, called when document is loaded
  function restoreSession() {
    link.restoreSession(identifier).then((result) => {
      session = result
      if (session) {
        didLogin();
      }
    })
  }

  // login and store session if sucessful
  function loginAnchor() {
    link.login(identifier).then((result) =>{
      session = result.session
      console.log(session.auth.actor);
      setIdcode("AC1A79F403500536");
      navigate(`/?playfabID=AC1A79F403500536`);
      didLogin()
    })
  }

  // logout and remove session from storage
  function logoutAnchor() {
    // document.body.classList.remove('logged-in')
    //session.remove();
  }

  // called when session was restored or created
  function didLoginAnchor() {
    // document.getElementById('account-name').textContent = session.auth.actor
    // document.body.classList.add('logged-in')
  }

  //-----------------wax cloud wallet------------------------

  const main = async () => {

    if (loggedIn) {
      console.log("Successfully login");
    } else
      await autoLogin();
  }
  const navigate = useNavigate();
  const autoLogin = async () => {
    let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
    if (isAutoLoginAvailable) {
      wallet_userAccount = wax.userAccount;
      loggedIn = true;
      await main();
    }
  }
  const login = async () => {
    try {
      if (!loggedIn) {
        wallet_userAccount = await wax.login();
        loggedIn = true;
        setLogin(false);
        setWalletAddress(wallet_userAccount);
        setIdcode("AC1A79F403500536");
        navigate(`/?playfabID=AC1A79F403500536`);
        await main();
      }
    } catch (e) {
    }
  }
  const logout = async () => {
    loggedIn = false;
    display_nft = false;
    wallet_userAccount = "";
    setWalletAddress("");
  }

  return (

    <div className="container">

      <Box
        sx={{
          width: 384,
          height: 470,
          backgroundColor: 'primary.dark',
          opacity: [0.9, 0.9, 0.9]
        }}
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)', padding: "20px 40px 20px 40px",
          borderRadius: "0.375rem", backgroundColor: "white"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div className="logoImg" >
            <img style={{ margin: "auto" }} src="/image/favicon.png"></img>
          </div>
          <div className="logoText" >
            <h1>Avalon Guard</h1>
          </div>
          <div style={{ width: "100%", textAlign: "center", marginTop: "16px" }}>
            <p>{loginFlag ? "Wallet Address" : walletAddress}</p>
          </div>
          <input className="verifyCode" placeholder={idCode} disabled value={idCode}></input>
          <button className="connect_button" style={{ backgroundColor: "#4b5563" }} onClick={() => loginAnchor()} >Connect Anchor Wallet</button>
          {loginFlag ? <button className="connect_button" style={{ backgroundColor: "#4b5563" }} onClick={() => login()} >Connect Wax Cloud Wallet</button>
            :
            <button className="connect_button" style={{ backgroundColor: "#2563eb" }} onClick={() => login()} >Verify Wallet</button>
          }
        </div>
      </Box>
    </div>
  );
};
