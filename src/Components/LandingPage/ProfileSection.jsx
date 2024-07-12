import { Box, Card, CardMedia, Container } from "@mui/material";
import React from "react";
import Profile from "../../Assets/profile.png";
import Profile2 from "../../Assets/profile2.png";
import Profile3 from "../../Assets/profile3.png";
import Profile4 from "../../Assets/profile4.png";
import Profile5 from "../../Assets/profile5.png";
import Profile6 from "../../Assets/Profile6.svg";

function ProfileSection() {
  const List = [
    {
      img: Profile6,
      id: 1,
      name: "Joanne",
      role: "Chief Human Resource Officer",
    },
    {
      img: Profile,
      id: 2,
      name: "Joanne",
      role: "Chief Human Resource Officer",
    },
    {
      img: Profile2,
      id: 3,
      name: "Amine",
      role: "Chief Marketing Officer",
    },
    {
      img: Profile3,
      id: 4,
      name: "Shedrah",
      role: "Chief Financial Officer",
    },
    {
      img: Profile4,
      id: 5,
      name: "Miller",
      role: "Chief Technical Officer",
    },
    {
      img: Profile5,
      id: 6,
      name: "Victor",
      role: "Chief Operations Officer",
    },
  ];

  return (
    <Container>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        my={3}
      >
        {List.map((list) => (
          <Card
            key={list.id}
            sx={{
              border: "1px solid #fff",
              transform: "rotate(6deg)",
              zIndex: list.id,
              position: "relative",
              transition: "all 0.5ms ease-in-out",
              left: 12,
              bgcolor: "#311760",
              "&:hover": {
                cursor: "pointer",
                transform: "rotate(0) scale(1.1)",
                zIndex: list.id + 3,
              },
              position: "relative",
            }}
            className="bg-card"
          >
            <Box width={150} height={220}>
              <img
                src={list.img}
                alt=""
                width={"100%"}
                height={"100%"}
                style={{ objectFit: "cover" }}
              />
            </Box>
            <Box
              position={"absolute"}
              bottom={0}
              left={0}
              right={0}
              className="profile-name"
              display={"none"}
            >
              <h4
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontSize: 16,
                  margin: 0,
                  fontFamily: "Gilroy Bold",
                }}
              >
                {list.name}
              </h4>
              <p
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontSize: 12,
                  margin: 0,
                  fontFamily: "Gilroy Light",
                }}
              >
                {list.role}
              </p>
            </Box>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default ProfileSection;
