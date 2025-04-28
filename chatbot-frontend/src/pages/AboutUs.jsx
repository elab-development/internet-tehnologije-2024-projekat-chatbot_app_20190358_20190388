import React, { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from "@mui/lab";
import {
  Lightbulb,
  RocketLaunch,
  BuildCircle,
  TrendingUp,
} from "@mui/icons-material";

const AboutUs = () => {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "About Aurora AI";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.substring(0, index));
      index++;

      if (index > fullText.length) {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #050505, #0d0d26, #131340)",
        color: "white",
        textAlign: "center",
        py: 8,
        px: 3,
      }}
    >
      <Container maxWidth="md">
        {/* Typewriter Animated Title */}
        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: { xs: "32px", md: "50px" },
            background: "linear-gradient(90deg, #f093fb, #f5576c, #24243e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 5,
            textShadow: "0px 0px 30px rgba(255, 0, 127, 1)",
          }}
        >
          {displayedText}
        </Typography>

        {/* Introductory Text */}
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "18px", md: "22px" },
            color: "#c4c6ff",
            lineHeight: 1.8,
            mb: 8,
            maxWidth: "85%",
            margin: "0 auto",
          }}
        >
          Aurora AI began with a bold vision: to revolutionize how businesses and individuals 
          harness artificial intelligence. Our mission is to develop cutting-edge algorithms, 
          intuitive solutions, and a sustainable technological ecosystem that drives innovation forward. 
          From our early days to our ambitious future, we lead AI advancements, empowering a global community 
          to embrace the **endless possibilities of intelligence**.
        </Typography>

        {/* Timeline */}
        <Timeline position="alternate">
          {/* Timeline Item 1 - Inception */}
          <TimelineItem>
            <TimelineOppositeContent sx={{ color: "white", flex: 0.2 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                2020
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  background: "linear-gradient(90deg, #f093fb, #f5576c)",
                  cursor: "pointer",
                  width: "80px",
                  height: "80px",
                  "&:hover": {
                    transform: "scale(1.3)",
                    boxShadow: "0 0 25px #f5576c",
                  },
                }}
              >
                <Lightbulb sx={{ fontSize: 55 }} />
              </TimelineDot>
              <TimelineConnector sx={{ backgroundColor: "#f5576c", height: "80px" }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: 4 }}>
              <Typography variant="h3" sx={{ color: "#f5576c", fontWeight: "bold" }}>
                Our Inception
              </Typography>
              <Typography variant="h6" sx={{ color: "#c4c6ff" }}>
                Aurora AI was founded by a team passionate about deep learning and machine intelligence.
                With a focus on real-world applications, ethics, and scalability, we laid the foundation
                for what would become a **pioneering AI company**.
              </Typography>
            </TimelineContent>
          </TimelineItem>

          {/* Timeline Item 2 - Growth */}
          <TimelineItem>
            <TimelineOppositeContent sx={{ color: "white", flex: 0.2 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                2021
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  background: "linear-gradient(90deg, #ff6a00, #ee0979)",
                  cursor: "pointer",
                  width: "80px",
                  height: "80px",
                  "&:hover": {
                    transform: "scale(1.3)",
                    boxShadow: "0 0 25px #ff6a00",
                  },
                }}
              >
                <RocketLaunch sx={{ fontSize: 55 }} />
              </TimelineDot>
              <TimelineConnector sx={{ backgroundColor: "#ff6a00", height: "80px" }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: 4 }}>
              <Typography variant="h3" sx={{ color: "#ff6a00", fontWeight: "bold" }}>
                Rapid Growth
              </Typography>
              <Typography variant="h6" sx={{ color: "#c4c6ff" }}>
                We expanded our technology stack with advanced neural networks and AI frameworks. 
                Strategic partnerships enabled us to **push AI adoption across industries worldwide**.
              </Typography>
            </TimelineContent>
          </TimelineItem>

          {/* Timeline Item 3 - Innovation */}
          <TimelineItem>
            <TimelineOppositeContent sx={{ color: "white", flex: 0.2 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                2022
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  background: "linear-gradient(90deg, #00eaff, #ffcc00)",
                  cursor: "pointer",
                  width: "80px",
                  height: "80px",
                  "&:hover": {
                    transform: "scale(1.3)",
                    boxShadow: "0 0 25px #00eaff",
                  },
                }}
              >
                <BuildCircle sx={{ fontSize: 55 }} />
              </TimelineDot>
              <TimelineConnector sx={{ backgroundColor: "#00eaff", height: "80px" }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: 4 }}>
              <Typography variant="h3" sx={{ color: "#00eaff", fontWeight: "bold" }}>
                Innovation & Refinement
              </Typography>
              <Typography variant="h6" sx={{ color: "#c4c6ff" }}>
                We focused on automation and personalization, refining our AI models to revolutionize
                **data-driven decision-making across industries**.
              </Typography>
            </TimelineContent>
          </TimelineItem>

          {/* Timeline Item 4 - Future Vision */}
          <TimelineItem>
            <TimelineOppositeContent sx={{ color: "white", flex: 0.2 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                2023+
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  background: "linear-gradient(90deg, #ff007f, #ffcc00)",
                  cursor: "pointer",
                  width: "80px",
                  height: "80px",
                  "&:hover": {
                    transform: "scale(1.3)",
                    boxShadow: "0 0 25px #ff007f",
                  },
                }}
              >
                <TrendingUp sx={{ fontSize: 55 }} />
              </TimelineDot>
            </TimelineSeparator>
            <TimelineContent sx={{ py: 4 }}>
              <Typography variant="h3" sx={{ color: "#ff007f", fontWeight: "bold" }}>
                Future Vision
              </Typography>
              <Typography variant="h6" sx={{ color: "#c4c6ff" }}>
                Aurora AI aims to **lead the next AI breakthroughs**, focusing on deep learning, automation,
                and real-world AI applications that **enhance everyday life**.
              </Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Container>
    </Box>
  );
};

export default AboutUs;
