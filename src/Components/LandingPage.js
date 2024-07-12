import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Grid,
  Box,
  InputBase,
  Paper,
  
} from "@mui/material";
import "./LandingPage.css";
import MenuIcon from "@mui/icons-material/Menu";
import { ImagePaths } from "./ImagePath";

function LandingPage() {
  return (
    <div>
      <AppBar position="static" className="appBar">
        <Toolbar>
          <img src={ImagePaths.Logo.default} alt="ADROX" clasṁsName="logo" />
          <div className="navLinks">
            <Button color="inherit" href="#whitepaper">
              White Paper
            </Button>
            <Button color="inherit" href="#roadmap">
              Road Map
            </Button>
            <Button color="inherit" href="#about">
              About
            </Button>
            <Button className="connectWalletButton" href="#connecṁt-wallet">
              Connect Wallet
            </Button>
          </div>
          <div className="socialIcons">
            <IconButton color="inherit">
              <img src={ImagePaths.Instagram.default} alt="instagram" />
            </IconButton>
            <IconButton color="inherit">
              <img src={ImagePaths.FaceBook.default} alt="facebook" />
            </IconButton>
            <IconButton color="inherit">
              <img src={ImagePaths.Twitter.default} alt="twitter" />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <Box className="hero">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} className="heroContent">
            <img
              src={ImagePaths.Text.default}
              alt="ADROX"
              className="heroText"
            />
            <Typography variant="body1" className="heroParagraph">
              Automated Decentralized Resource Optimization Exchange Wallet
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box className="presaleInfom">
              <Typography variant="h6" fontWeight="bold">
                Presale End Date will be Released Soon
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                1 ADX = 0.003$
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Button variant="contained" className="buyNowButton">
                  SOL
                </Button>
                <Button variant="outlined" className="buyNowButton">
                  USD
                </Button>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Button variant="outlined" className="buyNowButton">
                  SOL********
                </Button>
                <Button variant="outlined" className="buyNowButton">
                  ADX********
                </Button>
              </Box>
              <Button variant="contained" className="buyNowButton">
                Buy Now
              </Button>
              <Button variant="outlined" className="claimNowButton">
                Claim Now
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box position="relative">
          <img
            src={ImagePaths.Top}
            alt="Top"
            width="100%"
            style={{ zIndex: 50 }}
          />
          <img
            src={ImagePaths.FullGlobe}
            alt="Full Globe"
            width="100%"
            style={{ zIndex: 20, marginTop: "-1vw" }}
            height="50%"
          />
          <Box position="absolute" top="12vw">
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
                Lorem ipsum dolor sit amet consectetur. Massa ullamcorper
                imperdiet sed venantis diammus viverra curabitur magna. Ac
                imperdiet sociis aliquyamendis diammus viverra curabitur nim
                varius suspendisse temp.
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
                presale becomes available ensuring you're among the first to
                know and take action.
              </Typography>
              <Box display="flex" justifyContent="center" mt={2}>
                <InputBase
                  placeholder="Enter the Email Address"
                  inputProps={{ "aria-label": "Enter the Email Address" }}
                  style={{
                    padding: "10px",
                    width: "50%",
                    marginRight: "10px",
                    border: "1px solid white",
                    borderRadius: "20px",
                  }}
                />
                <Button variant="contained" className="buyNowButton">
                  Notify Me
                </Button>
              </Box>
            </section>
          </Box>
        </Box>

        <footer className="footer">
          <img
            src={ImagePaths.Logo.default}
            alt="ADROX"
            className="footerLogo"
          />
          <Box className="footerSections">
            <Box>
              <Typography variant="h3" className="featureTitle">
                Services
              </Typography>
              <Typography variant="body1" className="featureParagraph">
                Help Center
              </Typography>
              <Typography variant="body1" className="featureParagraph">
                Submit a Ticket
              </Typography>
              <Typography variant="body1" className="featureParagraph">
                Fees & VIP
              </Typography>
              <Typography variant="body1" className="featureParagraph">
                Ticket Verification
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" className="featureTitle">
                Legal
              </Typography>
              <Typography variant="body1" className="featureParagraph">
                Term of Use
              </Typography>
              <Typography variant="body1" className="featureParagraph">
                Privacy Policy
              </Typography>
              <Typography variant="body1" className="featureParagraph">
                Risk Disclosure Statement
              </Typography>
              <Typography variant="body1" className="featureParagraph">
                Special Treatment
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1">© 2024 All rights reserved</Typography>
        </footer>
      </Box>
    </div>
  );
}

export default LandingPage;
