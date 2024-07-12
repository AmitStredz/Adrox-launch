import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import RoadMap from "../../Assets/Roadmap Version .pdf";
import AboutCompany from "../../Assets/About the Company.pdf";
import { ImagePaths } from "../ImagePath";
import WhitePaper from "../../Assets/Whitepaper Ver One.pdf";
import { Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";

const drawerWidth = 240;

// Polyfill Buffer for the browser
window.Buffer = window.Buffer || Buffer;

// Use Alchemy RPC endpoint
const SOLANA_NETWORK =
  "https://solana-mainnet.g.alchemy.com/v2/tTYFLcPvnWiJ0bhFXWPUtKiA8P3TTs-v";
const API_URL = "https://adrox-presale-5ab85417dddf.herokuapp.com/api/";

function NavBar() {
  const [walletAddress, setWalletAddress] = React.useState(null);
  const [error, setError] = useState(null);
  const [solPrice, setSolPrice] = useState(null);
  const [solAddress, setSolAddress] = useState(null);

  const val = "helllo";
  useEffect(() => {
    const connectPhantomWallet = async () => {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        solana.on("connect", () => {
          console.log("Wallet connected");
          setWalletAddress(solana.publicKey.toString());
        });
        solana.on("disconnect", () => {
          console.log("Wallet disconnected");
          setWalletAddress(null);
        });
        if (solana.isConnected) {
          console.log("Wallet is already connected");
          setWalletAddress(solana.publicKey.toString());
        }
      }
    };
    connectPhantomWallet();

    const fetchSolPrice = async () => {
      try {
        console.log("Fetching SOL price...");
        const response = await axios.get(API_URL + "sol-price/");
        console.log("SOL Price Response:", response.data);
        setSolPrice(response.data.sol_price);
      } catch (err) {
        console.error("Error fetching SOL price:", err);
        setError("Failed to fetch SOL price. Please try again later.");
      }
    };

    const fetchSolAddress = async () => {
      try {
        console.log("Fetching SOL address...");
        const response = await axios.get(API_URL + "sol-address/");
        console.log("SOL Address Response:", response.data);
        setSolAddress(response.data.sol_address);
      } catch (err) {
        console.error("Error fetching SOL address:", err);
        setError("Failed to fetch SOL address. Please try again later.");
      }
    };

    fetchSolPrice();
    fetchSolAddress();
  }, []);

  const connectWallet = async () => {
    const { solana } = window;
    if (solana && solana.isPhantom) {
      try {
        console.log("Connecting to Phantom wallet...");
        await solana.connect();
        console.log("Connected to Phantom wallet");
      } catch (err) {
        console.error("Error connecting to wallet:", err);
      }
    } else {
      alert("Phantom Wallet not found. Please install it.");
    }
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box>
        <img src={ImagePaths.Logo.default} alt="ADROX" className="logo" />
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <a href={WhitePaper} download target="_blank">
              <Button
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontFamily: `Gilroy Light, "sans-serif"`,
                }}
              >
                White Paper
              </Button>
            </a>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <a href={RoadMap} download target="_blank">
              <Button
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontFamily: `Gilroy Light, "sans-serif"`,
                }}
              >
                Road Map
              </Button>
            </a>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <a href={AboutCompany} download target="_blank">
              <Button
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontFamily: `Gilroy Light, "sans-serif"`,
                }}
              >
                About
              </Button>
            </a>
          </ListItemButton>
        </ListItem>
      </List>
      <Box
        display="flex"
        justifyContent={"center"}
        alignItems={"center"}
        gap={2}
        flexDirection={"column"}
      >
        <Button
          onClick={connectWallet}
          className="connectWalletButton"
          href="#connect-wallet"
          sx={{
            color: "#fff",
            fontWeight: 600,
            fontFamily: `Gilroy Light, "sans-serif"`,
          }}
        >
          Connect Wallet
        </Button>
        <Box>
          <a href="https://www.instagram.com/adroxmarket/" target="_blank">
            <IconButton color="inherit" sx={{ p: 0 }}>
              <img src={ImagePaths.Instagram.default} alt="instagram" />
            </IconButton>
          </a>
          <a href="" target="">
            <IconButton color="inherit" sx={{ p: 0 }}>
              <img src={ImagePaths.FaceBook.default} alt="facebook" />
            </IconButton>
          </a>
          <a href="https://x.com/adroxorg?s=21" target="_blank">
            <IconButton color="inherit" sx={{ p: 0 }}>
              <img src={ImagePaths.Twitter.default} alt="twitter" />
            </IconButton>
          </a>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        className="appBar"
        id="master"
        sx={{
          background: "#8d5bff80",
          py: 1,
        }}
      >
        <Container>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: {
                xs: "flex-start",
                sm: "flex-start",
                md: "space-between",
              },
              gap: { xs: "50px", sm: "50px", md: "inherit" },
              alignItems: "center",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box>
              <img src={ImagePaths.Logo.default} alt="ADROX" className="logo" />
            </Box>
            <Box
              display={{ xs: "none", sm: "none", md: "flex" }}
              justifyContent={"center"}
              alignItems={"center"}
              gap={2}
            >
              <a href={WhitePaper} download target="_blank">
                <Button
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    fontFamily: `Gilroy Light, "sans-serif"`,
                  }}
                >
                  White Paper
                </Button>
              </a>
              <a href={RoadMap} download target="_blank">
                <Button
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    fontFamily: `Gilroy Light, "sans-serif"`,
                  }}
                >
                  Road Map
                </Button>
              </a>
              <a href={AboutCompany} download target="_blank">
                <Button
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    fontFamily: `Gilroy Light, "sans-serif"`,
                  }}
                >
                  About
                </Button>
              </a>
            </Box>
            <Box
              display={{ xs: "none", sm: "none", md: "flex" }}
              justifyContent={"center"}
              alignItems={"center"}
              gap={2}
            >
              <Button
                onClick={connectWallet}
                className="connectWalletButton"
                href="#connect-wallet"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontFamily: `Gilroy Light, "sans-serif"`,
                }}
              >
                {walletAddress
                  ? walletAddress.slice(0,5) +
                    "....." +
                    walletAddress.slice(-5)
                  : "Connect Wallet"}
              </Button>
              <a href="https://www.instagram.com/adroxmarket/" target="_blank">
                <IconButton color="inherit" sx={{ p: 0 }}>
                  <img src={ImagePaths.Instagram.default} alt="instagram" />
                </IconButton>
              </a>
              <a href="" target="">
                <IconButton color="inherit" sx={{ p: 0 }}>
                  <img src={ImagePaths.FaceBook.default} alt="facebook" />
                </IconButton>
              </a>
              <a href="https://x.com/adroxorg?s=21" target="_blank">
                <IconButton color="inherit" sx={{ p: 0 }}>
                  <img src={ImagePaths.Twitter.default} alt="twitter" />
                </IconButton>
              </a>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          className="drawer-bg"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

export default NavBar;
