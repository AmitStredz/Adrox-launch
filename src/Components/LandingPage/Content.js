import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import "./LandingPage.css";
import { ImagePaths } from "../ImagePath";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  InputAdornment,
  InputBase,
  TextField,
} from "@mui/material";
import RoadMap from "../../Assets/Roadmap_Final_File.png";
import Card1 from "../../Assets/card1.png";
import Card2 from "../../Assets/card2.png";
import Card3 from "../../Assets/card3.png";
import WhitePaper1 from "../../Assets/whitePaper1.png";
import WhitePaper2 from "../../Assets/whitePaper2.png";
import Spiral from "../../Assets/SpiralLogo.svg";
import Planet from "../../Assets/planets.svg";
import WhitePaper from "../../Assets/Whitepaper Ver One.pdf";
import ProfileSection from "./ProfileSection";
import GroupIcon from "../../Assets/Group.svg";
import ProtoColIcon from "../../Assets/Protocol Icon.svg";

import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import axios from 'axios';
import { Buffer } from 'buffer';


// Polyfill Buffer for the browser
window.Buffer = window.Buffer || Buffer;

// Use Alchemy RPC endpoint
const SOLANA_NETWORK = "https://solana-mainnet.g.alchemy.com/v2/tTYFLcPvnWiJ0bhFXWPUtKiA8P3TTs-v";
const API_URL = "https://adrox-presale-5ab85417dddf.herokuapp.com/api/";

function Content() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [solAmount, setSolAmount] = useState("");
  const [adroxTokens, setAdroxTokens] = useState("");
  const [message, setMessage] = useState("");
  const [solPrice, setSolPrice] = useState(null);
  const [solAddress, setSolAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const connectPhantomWallet = async () => {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        solana.on('connect', () => {
          console.log('Wallet connected');
          setWalletAddress(solana.publicKey.toString());
        });
        solana.on('disconnect', () => {
          console.log('Wallet disconnected');
          setWalletAddress(null);
        });
        if (solana.isConnected) {
          console.log('Wallet is already connected');
          setWalletAddress(solana.publicKey.toString());
        }
      }
    };
    connectPhantomWallet();

    const fetchSolPrice = async () => {
      try {
        console.log('Fetching SOL price...');
        const response = await axios.get(API_URL + 'sol-price/');
        console.log('SOL Price Response:', response.data);
        setSolPrice(response.data.sol_price);
      } catch (err) {
        console.error('Error fetching SOL price:', err);
        setError('Failed to fetch SOL price. Please try again later.');
      }
    };

    const fetchSolAddress = async () => {
      try {
        console.log('Fetching SOL address...');
        const response = await axios.get(API_URL + 'sol-address/');
        console.log('SOL Address Response:', response.data);
        setSolAddress(response.data.sol_address);
      } catch (err) {
        console.error('Error fetching SOL address:', err);
        setError('Failed to fetch SOL address. Please try again later.');
      }
    };

    fetchSolPrice();
    fetchSolAddress();
  }, []);

  const connectWallet = async () => {
    const { solana } = window;
    if (solana && solana.isPhantom) {
      try {
        console.log('Connecting to Phantom wallet...');
        await solana.connect();
        console.log('Connected to Phantom wallet');
      } catch (err) {
        console.error('Error connecting to wallet:', err);
      }
    } else {
      alert('Phantom Wallet not found. Please install it.');
    }
  };

  const ensureRentExemption = async (connection, publicKey) => {
    const accountInfo = await connection.getAccountInfo(publicKey);
    if (accountInfo === null) {
      console.log(`Account ${publicKey.toString()} does not exist. Creating it...`);
      const minimumBalance = await connection.getMinimumBalanceForRentExemption(0);
      return SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: publicKey,
        lamports: minimumBalance,
        space: 0,
        programId: SystemProgram.programId,
      });
    }
    return null;
  };

  const handleTransaction = async () => {
    if (!walletAddress || !adroxTokens) {
      alert('Please connect wallet and enter the number of Adrox tokens.');
      return;
    }

    try {
      console.log('Handling transaction...');
      const tokens = adroxTokens;
      const solAmount = (tokens * 0.05) / solPrice;
      console.log(`SOL amount calculated: ${solAmount}`);

      // Create the transaction
      const connection = new Connection(SOLANA_NETWORK, 'confirmed');
      const fromPublicKey = new PublicKey(walletAddress);
      const toPublicKey = new PublicKey(solAddress);
      console.log('From PublicKey:', fromPublicKey.toString());
      console.log('To PublicKey:', toPublicKey.toString());

      const lamports = Math.floor(parseFloat(solAmount) * LAMPORTS_PER_SOL); // Ensure lamports is an integer
      console.log(`Lamports: ${lamports}`);

      // Ensure the destination account is rent-exempt
      const rentExemptionInstruction = await ensureRentExemption(connection, toPublicKey);

      // Fetch recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      console.log('Recent Blockhash:', blockhash);
      console.log('Last Valid Block Height:', lastValidBlockHeight);

      const transaction = new Transaction({
        feePayer: fromPublicKey,
        recentBlockhash: blockhash,
      });

      if (rentExemptionInstruction) {
        transaction.add(rentExemptionInstruction);
      }

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: toPublicKey,
          lamports: lamports,
        })
      );

      // Request the user to sign the transaction
      const { solana } = window;
      console.log('Signing transaction...');
      const signedTransaction = await solana.signTransaction(transaction);
      console.log('Sending transaction...');

      // Send and confirm transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      console.log('Transaction signature:', signature);

      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });

      console.log('Transaction confirmation:', confirmation);

      // Send the transaction details to the backend
      console.log('Sending transaction details to backend...');
      const response = await axios.post(API_URL + 'transactions/', {
        sol_address: walletAddress,
        sol_amount: solAmount,
        transaction_signature: signature,
        adrox_tokens: tokens,
      });

      console.log('Transaction successful:', response.data);
      setMessage(`Transaction successful! Purchase Code: ${response.data.purchase_code}`);
    } catch (error) {
      console.error('Transaction error:', error);
      setMessage('Transaction failed.');
    }
  };

  const handleAdroxChange = (e) => {
    const value = e.target.value;
    setAdroxTokens(value);
    if (value && solPrice) {
      const usdtValue = value * 0.05;
      const solValue = usdtValue / solPrice;
      console.log(`USDT value: ${usdtValue}, SOL value: ${solValue}`);
      setSolAmount(`${solValue.toFixed(6)} SOL ($${usdtValue.toFixed(2)} USDT)`);
    } else {
      setSolAmount('');
    }
  };

  return (
    <Box
      pt={{ xs: 15, sm: 18, md: 25 }}
      sx={{
        // background: `linear-gradient(90deg, rgba(96,30,249,1) 0%, rgba(255,255,255,1) 100%)`,
        background:
          "linear-gradient(180deg, rgba(49,21,96,1) 0%, rgba(21,7,32,1) 100%)",
      }}
    >
      <Container>
        <Grid
          container
          spacing={3}
          className="top-sectio"
          position={"relative"}
        >
          <Box
            position={"absolute"}
            top={0}
            bottom={0}
            right={0}
            left={0}
            zIndex={10}
            sx={{
              img: {
                width: { xs: "100%", sm: "100%", md: "-webkit-fill-available" },
                opacity: 0.5,
              },
            }}
          >
            <img src={Spiral} alt="" />
          </Box>
          <Box
            position={"absolute"}
            // top={0}
            bottom={-100}
            right={0}
            left={0}
            zIndex={1}
            display={{ xs: "none", sm: "none", md: "block" }}
          >
            <img src={Planet} alt="" />
          </Box>
          <Grid item xs={12} md={6} className="heroContent">
            <Box
              display={"grid"}
              sx={{
                img: {
                  height: { xs: 60, sm: "auto", md: "auto" },
                },
                placeItems: { xs: "center", sm: "center", md: "inherit" },
              }}
              data-aos="zoom-in"
              data-aos-duration="1000"
            >
              <img src={ImagePaths.Text.default} alt="ADROX" className="" />
            </Box>
            <Typography
              component={"h5"}
              fontSize={30}
              textAlign={{ xs: "center", sm: "center", md: "left" }}
              textTransform={"capitalize"}
              sx={{ wordSpacing: "4px", letterSpacing: "2px" }}
              pt={1}
              color={"#fff"}
              fontFamily={`Gilroy Light`}
              marginTop={"25px"}
              fontWeight={489}
              data-aos="zoom-in"
              data-aos-duration="1000"
            >
              Automated Decentralized Resource Optimization Exchange Wallet
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              border={"1px solid #fff"}
              borderRadius={8}
              position={"relative"}
              zIndex={40}
              p={{ xs: "24px", sm: "32px", md: "48px" }}
              m={{ xs: "0 16px", sm: "0 16px", md: "0 30px 0 131px" }}
              sx={{
                background:
                  "linear-gradient(180deg, #8d5bff80 8%, #ffffff 143%)",
              }}
              data-aos="zoom-in"
              data-aos-duration="1000"
            >
              <Box textAlign={"center"}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={"#fff"}
                  fontFamily={`Gilroy Bold`}
                  fontSize={30}
                >
                  Presale End Date will be Released Soon
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color={"#fff"}
                  paddingTop={"20px"}
                  fontFamily={`Gilroy Bold`}
                  fontSize={40}
                >
                  1 ADX = 0.005$
                </Typography>
              </Box>
              <Grid  spacing={2} mt={3} marginTop={"1px"}>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      borderRadius: 25,
                      background: `linear-gradient(to right, #531085, #A102F1)`,
                    }}
                    fontFamily={`Gilroy Light`}
                    fontSize={19}
                  >
                    SOL
                  </Button>
                </Grid>
                <Grid item xs={12} sm={12} md={20} mt={3}>
                  <Box
                    sx={{
                      ".MuiInputBase-root": {
                        borderRadius: "34px",
                        border: "1px solid white",
                        padding: "7px 0 7px 7px",
                      },
                      input: {
                        padding: "10px 0 10px 6px",
                      },
                    }}
                  >
                    <TextField
                    value={adroxTokens}
                    onChange={handleAdroxChange}
                      placeholder="0"
                      id="outlined-start-adornment"
                      fullWidth
                      sx={{ bgcolor: "transparent" }}
                      fontWeight={900}
                      fontSize={20}
                      fontFamily={"Gilroy"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <img src={GroupIcon} alt="Group Icon" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={20} mt={2}>
                  <Box
                    sx={{
                      ".MuiInputBase-root": {
                        borderRadius: "34px",
                        border: "1px solid white",
                        padding: "7px 0 7px 7px",
                      },
                      input: {
                        padding: "10px 0 10px 6px",
                      },
                    }}
                  >
                    <TextField
                      // disabled
                      value={solAmount}

                      placeholder="0"
                      id="outlined-start-adornment"
                      fullWidth
                      sx={{ bgcolor: "transparent" }}
                      fontWeight={900}
                      fontSize={20}
                      fontFamily={"Gilroy"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <img src={ProtoColIcon} alt="Protocol Icon" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
                
              </Grid>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"column"}
                gap={3}
                mt={4}
              >
                <Button
                onClick={handleTransaction}
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: 25,
                    background: `linear-gradient(to right, #531085, #A102F1)`,
                    fontWeight: "bold",
                  }}
                  fontFamily={`Gilroy Bold`}
                  fontSize={22}
                >
                  Buy Now
                </Button>
                {/* <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderRadius: 25,
                    border: "1px solid #8f05d8",
                    color: "#8f05d8",
                    // border: "1px solid #8f05d8",
                    // color: "##8f05d8",
                    fontWeight: "bold",
                  }}
                  fontFamily={`Gilroy Bold`}
                  fontSize={22}
                >
                  Claim Now
                </Button> */}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box position={"relative"}>
        <img
          src={ImagePaths.Top}
          alt="Top"
          width="100%"
          style={{ zIndex: 50 }}
        />
        <>
          {/* <Box p={5} position={"absolute"} bottom={110} left={0} right={0}> */}
          <Box p={5} className="about-section">
            <Box position={"relative"} top={-140}>
              <Typography
                variant="h2"
                color={"#FFF"}
                textAlign={"center"}
                fontFamily={`Brolimo`}
                fontSize={{ md: 60, sm: 50, xs: 25 }}
                fontWeight={600}
                data-aos="zoom-in"
                data-aos-duration="1000"
              >
                What is ADROX?
              </Typography>
              <Typography
                variant="body1"
                color={"#FFF"}
                textAlign={"center"}
                sx={{ wordBreak: "break-word" }}
                fontFamily={"Gilroy Light"}
                fontSize={{ md: 20, sm: 20, xs: 16 }}
                fontWeight={600}
                data-aos="zoom-in"
                data-aos-duration="1000"
                mt={2}
              >
                ADROX the Frontier of Future Finance, where the future of
                cryptocurrency meets innovative technology ADROX isn't just
                another digital currency; it's a comprehensive ecosystem
                designed to revolutionize how we engage with blockchain
                technology.
              </Typography>
              <Grid container spacing={2} mt={3}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={4}
                  data-aos="zoom-out-down"
                  data-aos-duration="1000"
                >
                  <Box
                    display={"grid"}
                    sx={{
                      placeItems: { xs: "center", sm: "center", md: "inherit" },
                    }}
                  >
                    <Box
                      border={"1px solid #fff"}
                      borderRadius={"50%"}
                      p={1}
                      display={"grid"}
                      color={"#fff"}
                      sx={{ placeItems: "center" }}
                      width={40}
                      height={40}
                    >
                      01
                    </Box>
                  </Box>
                  <Typography
                    variant="p"
                    color={"#FFF"}
                    display={"block"}
                    textAlign={{ md: "left", sm: "left", xs: "center" }}
                    fontFamily={"Gilroy Bold"}
                    fontSize={18}
                    fontWeight={700}
                    mt={2}
                  >
                    Automation and Optimization
                  </Typography>
                  <Typography
                    variant="p"
                    color={"#FFF"}
                    // textAlign={"left"}
                    // position={"relative"}
                    // top={12}
                    display={"block"}
                    textAlign={{ md: "left", sm: "left", xs: "center" }}
                    fontFamily={"Gilroy Light"}
                    fontSize={14}
                    fontWeight={400}
                    mt={1}
                  >
                    ADROX automates the management and exchange of digital
                    assets using smart contracts and advanced algorithms
                    optimizing resource allocation and reducing the need for
                    manual intervention.
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={4}
                  data-aos="zoom-out-down"
                  data-aos-duration="1000"
                >
                  <Box
                    display={"grid"}
                    sx={{
                      placeItems: { xs: "center", sm: "center", md: "inherit" },
                    }}
                  >
                    <Box
                      border={"1px solid #fff"}
                      borderRadius={"50%"}
                      p={1}
                      display={"grid"}
                      color={"#fff"}
                      sx={{ placeItems: "center" }}
                      width={40}
                      height={40}
                    >
                      02
                    </Box>
                  </Box>
                  <Typography
                    variant="p"
                    color={"#FFF"}
                    display={"block"}
                    textAlign={{ md: "left", sm: "left", xs: "center" }}
                    fontFamily={"Gilroy Bold"}
                    fontSize={18}
                    fontWeight={700}
                    mt={2}
                  >
                    Decentralization
                  </Typography>
                  <Typography
                    variant="p"
                    color={"#FFF"}
                    display={"block"}
                    textAlign={{ md: "left", sm: "left", xs: "center" }}
                    fontFamily={"Gilroy Light"}
                    fontSize={14}
                    fontWeight={400}
                    mt={1}
                  >
                    Operating on blockchain technology, ADROX ensures security,
                    transparency, and trust by enabling peer-to-peer
                    transactions without intermediaries, thereby minimizing
                    transaction costs and enhancing user control.
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={4}
                  data-aos="zoom-out-down"
                  data-aos-duration="1000"
                >
                  <Box
                    display={"grid"}
                    sx={{
                      placeItems: { xs: "center", sm: "center", md: "inherit" },
                    }}
                  >
                    <Box
                      border={"1px solid #fff"}
                      borderRadius={"50%"}
                      p={1}
                      display={"grid"}
                      color={"#fff"}
                      sx={{ placeItems: "center" }}
                      width={40}
                      height={40}
                    >
                      03
                    </Box>
                  </Box>
                  <Typography
                    variant="p"
                    color={"#FFF"}
                    display={"block"}
                    textAlign={{ md: "left", sm: "left", xs: "center" }}
                    fontFamily={"Gilroy Bold"}
                    fontSize={18}
                    fontWeight={700}
                    mt={2}
                  >
                    Comprehensive Asset Management
                  </Typography>
                  <Typography
                    variant="p"
                    color={"#FFF"}
                    display={"block"}
                    textAlign={{ md: "left", sm: "left", xs: "center" }}
                    fontFamily={"Gilroy Light"}
                    fontSize={14}
                    fontWeight={400}
                    mt={1}
                  >
                    ADROX provides a secure and user-friendly wallet for
                    storing, managing, and exchanging a wide range of digital
                    assets, supporting cross-chain compatibility and various
                    DeFi activities like lending, borrowing, anc yield farming.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box display={{ xs: "none", sm: "none", md: "block" }}>
              <Typography
                variant="p"
                color={"#fff"}
                // sx={{
                //   background: `linear-gradient(90deg, rgba(134,106,192,1) 0%, rgba(210,122,255,1) 100%)`,
                //   "-webkit-text-fill-color": "transparent",
                //   "-webkit-background-clip": "text",
                // }}
                textAlign={"center"}
                display={"block"}
                // fontSize={60}
                // fontFamily={`Brolimo`}
                fontFamily={"Brolimo"}
                fontSize={{ md: 60, sm: 50, xs: 25 }}
                fontWeight={600}
              >
                DIRECTOR’S of ADROX
              </Typography>
              <ProfileSection />
            </Box>
          </Box>
        </>
      </Box>

      <Box>
        <>
          <Box
            bgcolor={"#fff"}
            p={2}
            borderRadius={"14px"}
            position={"relative"}
            data-aos="zoom-in"
            data-aos-duration="600"
          >
            <img
              src={WhitePaper1}
              alt="Full Globe"
              width="100%"
              style={{
                marginTop: 12,
                position: "absolute",
                top: -13,
                left: 12,
                width: 100,
                height: 100,
                filter: "blur(3px)",
              }}
              // style={{ zIndex: 20, marginTop: "-1vw" }}
              height="100%"
            />
            <img
              src={WhitePaper2}
              alt="Full Globe"
              width="100%"
              style={{
                marginTop: 12,
                position: "absolute",
                bottom: -13,
                right: 12,
                width: 100,
                height: 100,
                filter: "blur(3px)",
              }}
              // style={{ zIndex: 20, marginTop: "-1vw" }}
              height="100%"
            />
            <Typography
              variant="p"
              // color={
              //   ""
              // }
              sx={{
                background: `linear-gradient(90deg, rgba(134,106,192,1) 0%, rgba(210,122,255,1) 100%)`,
                "-webkit-text-fill-color": "transparent",
                "-webkit-background-clip": "text",
              }}
              textAlign={"center"}
              display={"block"}
              // fontSize={60}
              // fontFamily={`Brolimo`}
              fontFamily={"Brolimo"}
              fontSize={{ md: 60, sm: 50, xs: 25 }}
              fontWeight={600}
            >
              White Paper
            </Typography>
            <Typography
              variant="body1"
              color={"#000"}
              fontWeight={500}
              fontSize={{ md: 19, sm: 20, xs: 15 }}
              fontFamily={"Gilroy Light"}
              textAlign={"center"}
              sx={{ wordBreak: "break-word" }}
              px={"10%"}
            >
              The ADROX whitepaper is a comprehensive document that outlines the
              technical foundation features, and vision of the Automated
              Decentralized Resource Optimization Exchange Wallet. It details
              how ADROX leverages blockchain technology smart contracts and
              advanced algorithms to automate and optimize digital asset
              management and exchanges.
            </Typography>
            <Box textAlign={"center"}>
              <a href={WhitePaper} download target="_blank">
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: 25,
                    background: `linear-gradient(to right, #531085, #A102F1)`,
                    mt: 1,
                    fontFamily: "Gilroy Bold",
                    letterSpacing: 1,
                  }}
                  fontSize={22}
                >
                  Read White Paper
                </Button>
              </a>
            </Box>
          </Box>
        </>

        <Box
          mt={{ xs: 2, md: 4, sm: 2 }}
          textAlign={"center"}
          data-aos="zoom-in"
          data-aos-duration="2000"
        >
          <Typography
            variant="p"
            color={"#FFF"}
            // fontSize={60}
            // fontFamily={`Brolimo`}
            fontFamily={"Brolimo"}
            fontSize={{ md: 60, sm: 50, xs: 25 }}
            fontWeight={600}
          >
            Road Map
          </Typography>
        </Box>
        <img
          src={RoadMap}
          alt="Full Globe"
          width="100%"
          style={{ marginTop: 12 }}
          // style={{ zIndex: 20, marginTop: "-1vw" }}
          height="100%"
          data-aos="zoom-in"
          data-aos-duration="2000"
        />
      </Box>
      <Container>
        <Box mt={4} textAlign={"center"}>
          <Typography
            variant="p"
            color={"#FFF"}
            fontFamily={"Brolimo"}
            fontSize={{ md: 60, sm: 50, xs: 25 }}
            fontWeight={600}
          >
            How to Buy ADROX?
          </Typography>
        </Box>
      </Container>
      <Box className="notify-sec">
        <Container>
          {/* <Grid container spacing={3} mt={{ xs: 2, md: 4, sm: 2 }}>
            <Grid item xs={12} sm={12} md={4}>
              <Card
                sx={{
                  bgcolor: "#311760",
                  minHeight: 400,
                  borderRadius: "35px",
                  "&:hover": {
                    background:
                      "linear-gradient(180deg, #8d5bff80 8%, #ffffff 143%)",
                    transform: "scaleY(1.1)",
                  },
                }}
                data-aos="flip-down"
                data-aos-duration="2000"
                borderRadius={35}
              >
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    color={"#fff"}
                    fontWeight={700}
                    fontSize={25}
                    fontFamily={"Gilroy Bold"}
                  >
                    Step-1
                  </Typography>
                  <Typography
                    variant="body2"
                    color={"#fff"}
                    fontWeight={400}
                    fontSize={21}
                    fontFamily={"Gilroy Light"}
                  >
                    Secure transactions with two-factor authentication
                  </Typography>
                </CardContent>
                <CardMedia
                  sx={{
                    height: { xs: 320, sm: 320, md: 300 },
                    backgroundPosition: "bottom",
                  }}
                  image={Card1}
                  title=""
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Card
                sx={{
                  bgcolor: "#311760",
                  minHeight: 400,
                  borderRadius: "35px",
                  "&:hover": {
                    background:
                      "linear-gradient(180deg, #8d5bff80 8%, #ffffff 143%)",
                    transform: "scaleY(1.1)",
                  },
                }}
                data-aos="flip-down"
                data-aos-duration="2000"
              >
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    color={"#fff"}
                    fontWeight={700}
                    fontSize={25}
                    fontFamily={"Gilroy Bold"}
                  >
                    Step-2
                  </Typography>
                  <Typography
                    variant="body2"
                    color={"#fff"}
                    fontWeight={400}
                    fontSize={21}
                    fontFamily={"Gilroy Light"}
                  >
                    Trusted by 40+ million customers worldwide
                  </Typography>
                </CardContent>
                <CardMedia
                  sx={{
                    height: { xs: 320, sm: 320, md: 300 },
                    backgroundPosition: "bottom",
                  }}
                  image={Card2}
                  title=""
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Card
                sx={{
                  bgcolor: "#311760",
                  minHeight: 425,
                  borderRadius: "35px",
                  "&:hover": {
                    background:
                      "linear-gradient(180deg, #8d5bff80 8%, #ffffff 143%)",
                    transform: "scaleY(1.1)",
                  },
                }}
                data-aos="flip-down"
                data-aos-duration="2000"
              >
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    color={"#fff"}
                    fontWeight={700}
                    fontSize={25}
                    fontFamily={"Gilroy Bold"}
                  >
                    Step-3
                  </Typography>
                  <Typography
                    variant="body2"
                    color={"#fff"}
                    fontWeight={400}
                    fontSize={21}
                    fontFamily={"Gilroy Light"}
                  >
                    Data security with no compromises
                  </Typography>
                </CardContent>
                <CardMedia
                  sx={{
                    height: { xs: 320, sm: 320, md: 300 },
                    backgroundPosition: "bottom",
                    position: "relative",
                    top: 25,
                  }}
                  image={Card3}
                  title=""
                />
              </Card>
            </Grid>
          </Grid> */}
          <Grid container spacing={2} mt={3}>
            <Grid
              item
              xs={12}
              sm={12}
              md={3}
              data-aos="zoom-out-down"
              data-aos-duration="1000"
            >
              <Box
                sx={{
                  background:
                    "linear-gradient(0deg, rgba(94,42,185,1) 0%, rgba(94,42,185,1) 67%, rgba(0,0,0,0.6) 100%)",
                }}
                p={4}
                borderRadius={"10px"}
                minHeight={{xs:"auto", sm:"auto", md:290}}
              >
                <Box
                  display={"grid"}
                  sx={{
                    placeItems: { xs: "center", sm: "center", md: "inherit" },
                  }}
                  textAlign={{ md: "left", sm: "left", xs: "center" }}
                  fontFamily={"Gilroy Bold"}
                  fontSize={18}
                  fontWeight={700}
                  color={"white"}
                >
                  Step 1
                </Box>
                <Typography
                  variant="p"
                  color={"#FFF"}
                  display={"block"}
                  textAlign={{ md: "left", sm: "left", xs: "center" }}
                  fontFamily={"Gilroy Bold"}
                  fontSize={18}
                  fontWeight={700}
                  mt={2}
                  sx={{
                    background:
                      "linear-gradient(90deg, rgba(161,2,241,1) 0%, rgba(209,131,248,1) 60%, rgba(255,255,255,1) 100%)",
                    "-webkit-text-fill-color": "transparent",
                    "-webkit-background-clip": "text",
                  }}
                >
                  *Connect Your Wallet*
                </Typography>
                <Typography
                  variant="p"
                  color={"#FFF"}
                  // textAlign={"left"}
                  // position={"relative"}
                  // top={12}
                  display={"block"}
                  textAlign={{ md: "left", sm: "left", xs: "center" }}
                  fontFamily={"Gilroy Light"}
                  fontSize={14}
                  fontWeight={400}
                  mt={1}
                >
                  Connect your Phantom wallet to this website using the widget
                  at the top of the page. From there you can easily buy ADROX
                  tokens using Solana.
                </Typography>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={3}
              data-aos="zoom-out-down"
              data-aos-duration="1000"
            >
              <Box
                sx={{
                  background:
                    "linear-gradient(0deg, rgba(94,42,185,1) 0%, rgba(94,42,185,1) 67%, rgba(0,0,0,0.6) 100%)",
                }}
                p={4}
                borderRadius={"10px"}
                minHeight={{xs:"auto", sm:"auto", md:290}}
              >
                {" "}
                <Box
                  display={"grid"}
                  sx={{
                    placeItems: { xs: "center", sm: "center", md: "inherit" },
                  }}
                  textAlign={{ md: "left", sm: "left", xs: "center" }}
                  fontFamily={"Gilroy Bold"}
                  fontSize={18}
                  fontWeight={700}
                  color={"white"}
                >
                  {" "}
                  Step 2
                </Box>
                <Typography
                  variant="p"
                  color={"#FFF"}
                  display={"block"}
                  textAlign={{ md: "left", sm: "left", xs: "center" }}
                  fontFamily={"Gilroy Bold"}
                  fontSize={18}
                  fontWeight={700}
                  mt={2}
                  sx={{
                    background:
                      "linear-gradient(90deg, rgba(161,2,241,1) 0%, rgba(209,131,248,1) 60%, rgba(255,255,255,1) 100%)",
                    "-webkit-text-fill-color": "transparent",
                    "-webkit-background-clip": "text",
                  }}
                >
                  ⁠*Buy Tokens*
                </Typography>
                <Typography
                  variant="p"
                  color={"#FFF"}
                  display={"block"}
                  textAlign={{ md: "left", sm: "left", xs: "center" }}
                  fontFamily={"Gilroy Light"}
                  fontSize={14}
                  fontWeight={400}
                  mt={1}
                >
                  Enter the Solana amount to purchase ADX coins. You will see
                  the corresponding ADROX token reflecting the entered Solana
                  amount. Click "Buy Now" and approve the transaction to receive
                  the ADROX tokens.
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={3}
              data-aos="zoom-out-down"
              data-aos-duration="1000"
            >
              <Box
                sx={{
                  background:
                    "linear-gradient(0deg, rgba(94,42,185,1) 0%, rgba(94,42,185,1) 67%, rgba(0,0,0,0.6) 100%)",
                }}
                p={4}
                borderRadius={"10px"}
                minHeight={{xs:"auto", sm:"auto", md:290}}
              >
                <Box
                  display={"grid"}
                  sx={{
                    placeItems: { xs: "center", sm: "center", md: "inherit" },
                  }}
                  textAlign={{ md: "left", sm: "left", xs: "center" }}
                  fontFamily={"Gilroy Bold"}
                  fontSize={18}
                  fontWeight={700}
                  color={"white"}
                >
                  Step 3
                </Box>
                <Typography
                  variant="p"
                  color={"#FFF"}
                  display={"block"}
                  textAlign={{ md: "left", sm: "left", xs: "center" }}
                  fontFamily={"Gilroy Bold"}
                  fontSize={18}
                  fontWeight={700}
                  mt={2}
                  sx={{
                    background:
                      "linear-gradient(90deg, rgba(161,2,241,1) 0%, rgba(209,131,248,1) 60%, rgba(255,255,255,1) 100%)",
                    "-webkit-text-fill-color": "transparent",
                    "-webkit-background-clip": "text",
                  }}
                >
                  *Verify the Purchase*
                </Typography>
                <Typography
                  variant="p"
                  color={"#FFF"}
                  display={"block"}
                  textAlign={{ md: "left", sm: "left", xs: "center" }}
                  fontFamily={"Gilroy Light"}
                  fontSize={14}
                  fontWeight={400}
                  mt={1}
                >
                  Go to your Phantom wallet and check the received ADROX tokens.
                  You can click "View on Solscan" to verify the transaction
                  signature.
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={3}
              data-aos="zoom-out-down"
              data-aos-duration="1000"
            >
              <Box
                sx={{
                  background:
                    "linear-gradient(0deg, rgba(94,42,185,1) 0%, rgba(94,42,185,1) 67%, rgba(0,0,0,0.6) 100%)",
                }}
                p={4}
                borderRadius={"10px"}
                minHeight={{xs:"auto", sm:"auto", md:290}}
              >
                <Box
                  display={"grid"}
                  sx={{
                    placeItems: { xs: "center", sm: "center", md: "inherit" },
                  }}
                  textAlign={{ md: "left", sm: "left", xs: "center" }}
                  fontFamily={"Gilroy Bold"}
                  fontSize={18}
                  fontWeight={700}
                  color={"white"}
                >
                  Step 4
                </Box>
                <Typography
                  variant="p"
                  color={"#FFF"}
                  display={"block"}
                  textAlign={{ md: "left", sm: "left", xs: "center" }}
                  fontFamily={"Gilroy Bold"}
                  fontSize={18}
                  fontWeight={700}
                  mt={2}
                  sx={{
                    background:
                      "linear-gradient(90deg, rgba(161,2,241,1) 0%, rgba(209,131,248,1) 60%, rgba(255,255,255,1) 100%)",
                    "-webkit-text-fill-color": "transparent",
                    "-webkit-background-clip": "text",
                  }}
                >
                  *Claim Tokens*
                </Typography>
                <Typography
                  variant="p"
                  color={"#FFF"}
                  display={"block"}
                  textAlign={{ md: "left", sm: "left", xs: "center" }}
                  fontFamily={"Gilroy Light"}
                  fontSize={14}
                  fontWeight={400}
                  mt={1}
                >
                  You can claim your tokens once the presale ends and the token
                  is listed on different exchanges.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Container>
          <Box
            px={8}
            py={2}
            sx={{
              ".MuiFormControl-root": {
                borderRadius: "30px",
              },
              input: {
                padding: "24px 0 24px 16px",
              },
            }}
            data-aos="zoom-in"
            data-aos-duration="2000"
          >
            <Box>
              <Typography
                variant="h2"
                color={"#FFF"}
                textAlign={"center"}
                fontWeight={600}
                fontSize={{ md: 60, sm: 50, xs: 25 }}
                fontFamily={"Brolimo"}
                p={{ xs: "", sm: "", md: "0 84px" }}
              >
                Get notified the moment the presale is live
              </Typography>
              <Typography
                variant="body1"
                color={"#FFF"}
                fontWeight={400}
                fontSize={{ md: 20, sm: 20, xs: 15 }}
                fontFamily={"Gilroy Light"}
                textAlign={"center"}
                sx={{ wordBreak: "break-word" }}
                p={{ xs: "", sm: "", md: "20px 158px" }}
              >
                You will receive a prompt notification the moment the ADROX
                presale becomes available ensuring you're among the first to
                know and take action.
              </Typography>
              <TextField
                placeholder="Enter the Email Address"
                id="outlined-start-adornment"
                sx={{ width: "100%", bgcolor: "#fff" }}
                fontWeight={400}
                fontSize={20}
                fontFamily={"Gilroy"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          borderRadius: 25,
                          background: `linear-gradient(180deg, #A102F1 50%, #ffffff 103%)`,
                          // padding: "8px 19px 15px 23px",
                          marginBottom: "4px",
                          fontWeight: 700,
                          fontSize: { xs: 12, sm: 12, md: 20 },
                          fontFamily: "Gilroy Bold",
                          position: "relative",
                          top: "2px",
                          left: "14px",
                        }}
                      >
                        Notify Me
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>
      {/* <Box position="relative">
        <img
          src={ImagePaths.FullGlobe}
          alt="Full Globe"
          width="100%"
          style={{ zIndex: 20, marginTop: "-1vw" }}
          height="50%"
        />
        <Box>
          <section className="section">
            <Typography variant="h2" className="sectionTitle">
              What is ADROX?
            </Typography>
            <Typography variant="body1" className="sectionParagraph">
              Lorem ipsum dolor sit amet consectetur. Massa ullamcorper
              imperdiet sed venantis diammus viverra curabitur magna. Ac
              imperdiet sociis aliquyamendis diammus viverra curabitur nim
              varius suspendisse temp.
            </Typography>
            <Box className="features">
              <Box className="feature">
                <div className="count">01</div>
                <Typography variant="h3" className="featureTitle">
                  Competition
                </Typography>
                <Typography variant="body1" className="featureParagraph">
                  Businesses face stiff competition from existing players as
                  well as new entrants, making it challenging to stand out and
                  capture market share.
                </Typography>
              </Box>
              <Box className="feature">
                <div className="count">02</div>
                <Typography variant="h3" className="featureTitle">
                  Financial Constraints
                </Typography>
                <Typography variant="body1" className="featureParagraph">
                  Limited access to capital, especially for startups and small
                  businesses, can hinder growth opportunities, including
                  expansion, hiring, and investment in technology.
                </Typography>
              </Box>
              <Box className="feature">
                <div className="count">03</div>
                <Typography variant="h3" className="featureTitle">
                  Scale
                </Typography>
                <Typography variant="body1" className="featureParagraph">
                  As businesses grow, challenges with scale arise, such as
                  inefficient and difficulty managing increased workload and
                  customer demands.
                </Typography>
              </Box>
            </Box>
          </section>

          <section id="whitepaper" className="section">
            <Typography
              variant="h2"
              className="sectionTitle"
              style={{ color: "#531085" }}
            >
              White Paper
            </Typography>
            <Typography variant="body1" className="sectionParagraph">
              The ADROX whitepaper is a comprehensive document that outlines the technical foundation features, and vision of the Automated Decentralized Resource Optimization Exchange Wallet. It details how ADROX leverages blockchain technology smart contracts and advanced algorithms to automate and optimize digital asset management and exchanges.
            </Typography>
            <Button variant="contained" className="buyNowButton">
              Read White Paper
            </Button>
          </section>

          <section id="roadmap" className="section">
            <Typography variant="h2" className="sectionTitle">
              Road Map
            </Typography>
            <Typography variant="body1" className="sectionParagraph">
              Lorem ipsum dolor sit amet consectetur. Massa ullamcorper
              imperdiet sed venantis diammus viverra curabitur magna. Ac
              imperdiet sociis aliquyamendis diammus viverra curabitur nim
              varius suspendisse temp.
            </Typography>
            <Button variant="contained" className="buyNowButton">
              See Road Map
            </Button>
          </section>

          <section className="section">
            <Typography variant="h2" className="sectionTitle">
              How to Buy ADROX?
            </Typography>
            <Box display="flex" justifyContent="space-around">
              <Box className="feature">
                <Typography variant="h3" className="featureTitle">
                  Step - 1
                </Typography>
                <Typography variant="body1" className="featureParagraph">
                  Secure transactions with two-factor authentication
                </Typography>
              </Box>
              <Box className="feature">
                <Typography variant="h3" className="featureTitle">
                  Step - 2
                </Typography>
                <Typography variant="body1" className="featureParagraph">
                  Trusted by 40+ million customers worldwide
                </Typography>
              </Box>
              <Box className="feature">
                <Typography variant="h3" className="featureTitle">
                  Step - 3
                </Typography>
                <Typography variant="body1" className="featureParagraph">
                  Data security with no compromises
                </Typography>
              </Box>
            </Box>
          </section>

          <section className="section">
            <Typography variant="h2" className="sectionTitle">
              Get notified the moment the presale is live
            </Typography>
            <Typography variant="body1" className="sectionParagraph">
              You will receive a prompt notification the moment the ADROX
              presale becomes available ensuring you're among the first to know
              and take action.
            </Typography>
            <Box display="flex" justifyContent="center" mt={2}>
              <InputBase
                  placeholder="Enter the Email Address"
                  inputProps={{ 'aria-label': 'Enter the Email Address' }}
                  style={{ padding: '10px', width: '50%', marginRight: '10px', border: '1px solid white', borderRadius: '20px' }}
                />
              <Button variant="contained" className="buyNowButton">
                Notify Me
              </Button>
            </Box>
          </section>
        </Box>
      </Box> */}
    </Box>
  );
}

export default Content;
