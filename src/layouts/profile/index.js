/**
=========================================================
* Soft UI Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-material-ui
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// @mui icons
// import FacebookIcon from "@mui/icons-material/Facebook";
// import TwitterIcon from "@mui/icons-material/Twitter";
// import InstagramIcon from "@mui/icons-material/Instagram";

// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";
import SuiInput from "components/SuiInput";
import SuiTypography from "components/SuiTypography";

// Soft UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
// import ProfilesList from "examples/Lists/ProfilesList";

// Overview page components
import Header from "layouts/profile/components/Header";
import SuiButton from "components/SuiButton";
// import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
// import profilesListData from "layouts/profile/data/profilesListData";

// // Images

const Overview = () => {
  const [posts, setPosts] = useState([]);
  const [feed, setFeed] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    if (title.length === 0 || content.length === 0) {
      alert("Please fill all the inputs!");
    } else {
      console.log(title, content);
      const data = {};
      data.title = title;
      data.content = content;
      const url = "https://my-worker.tiagoalves.workers.dev/post";
      console.log(data);
      fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
      }).then((response) => {
        if (response.ok) {
          const newPost = {
            id: posts.length,
            title,
            username: "guestUser123",
            content,
          };
          posts.unshift(newPost);
          setFeed(posts);
          document.getElementById("title").value = "";
          document.getElementById("content").value = "";
        }
      });
    }
  };

  const handleUpVote = (event, id) => {
    posts[posts.length - id - 1].votes += 1;
    const url = "https://my-worker.tiagoalves.workers.dev/upvote";
    const data = {};
    data.id = id;
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        setFeed(posts);
      }
    });
  };

  const handleDownVote = (event, id) => {
    posts[posts.length - id - 1].votes -= 1;
    const url = "https://my-worker.tiagoalves.workers.dev/downvote";
    const data = {};
    data.id = id;
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        setFeed(posts);
      }
    });
  };

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      posts.sort((a, b) => b.id - a.id);
      setFeed(posts);
    } else if (newValue === 1) {
      posts.sort((a, b) => b.votes - a.votes);
      setFeed(posts);
    }
  };

  useEffect(() => {
    const getPosts = async () => {
      const resp = await fetch("https://my-worker.tiagoalves.workers.dev/post");
      const postsResp = await resp.json();
      if (tabValue === 0) {
        setPosts(JSON.parse(postsResp).reverse());
      } else if (tabValue === 1) {
        setPosts(JSON.parse(postsResp).sort((a, b) => b.votes - a.votes));
      }
    };
    getPosts();
    setFeed(posts);
  }, [feed]);

  return (
    <DashboardLayout>
      <Header />
      <SuiBox pt={2} pb={3} px={3}>
        <SuiBox component="form" role="form">
          <SuiBox mb={2}>
            <SuiInput placeholder="Title" id="title" />
          </SuiBox>
          <SuiBox mb={2}>
            <SuiInput placeholder="Content" id="content" />
          </SuiBox>
          <SuiBox mt={4} mb={1}>
            <SuiButton
              onClick={(e) => {
                handleSubmit(e);
              }}
              variant="gradient"
              color="dark"
              fullWidth
            >
              Post!
            </SuiButton>
          </SuiBox>
        </SuiBox>
      </SuiBox>
      <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
        <AppBar position="static">
          <SuiTypography variant="button" fontWeight="regular" color="text">
            Sort By:
          </SuiTypography>
          <Tabs
            orientation="horizontal"
            value={tabValue}
            onChange={handleSetTabValue}
            sx={{ background: "transparent" }}
          >
            <Tab label="New" />
            <Tab label="Votes" />
          </Tabs>
        </AppBar>
      </Grid>
      {posts.map((post) => (
        <SuiBox mt={5} mb={3} key={post.id}>
          <Grid>
            <Grid item xs={12} md={12} xl={12}>
              <SuiTypography variant="button" fontWeight="regular" color="text">
                @{post.username}
              </SuiTypography>
              <ProfileInfoCard title={post.title} description={post.content} />
              <SuiBox
                display="flex"
                alignItems="center"
                mt={{ xs: 2, sm: 0 }}
                ml={{ xs: -1.5, sm: 0 }}
              >
                <SuiBox mr={1}>
                  <SuiTypography variant="button" fontWeight="regular" color="text">
                    {post.votes}
                  </SuiTypography>
                  <SuiButton
                    onClick={(e) => {
                      handleUpVote(e, post.id);
                    }}
                    variant="text"
                    color="dark"
                  >
                    <ThumbUpIcon>upvote</ThumbUpIcon>upvote
                  </SuiButton>
                </SuiBox>
                <SuiButton
                  onClick={(e) => {
                    handleDownVote(e, post.id);
                  }}
                  variant="text"
                  color="error"
                >
                  <ThumbDownIcon>downvote</ThumbDownIcon>&nbsp;downvote
                </SuiButton>
              </SuiBox>
            </Grid>
            {/* <Grid item xs={12} xl={4}>
              <ProfilesList title="conversations" profiles={profilesListData} />
            </Grid> */}
          </Grid>
        </SuiBox>
      ))}

      <Footer />
    </DashboardLayout>
  );
};

export default Overview;
