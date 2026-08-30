"use client";
import Head from "next/head";
import { Col, Row } from "reactstrap";
import Blog from "@/app/(DashboardLayout)/components/dashboard/Blog";

const HomeView = ({ blogData, salesChart, feeds, projectTables }) => {
  return (
    <div>
      <Head>
        <title>Monster Free NextJs Admin Template by Wrappixel</title>
        <meta
          name="description"
          content="Monster Free NextJs Admin Template by Wrappixel"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {/***Sales & Feed***/}
        <Row>
          <Col sm="12" lg="6" xl="7" xxl="8">
            {salesChart}
          </Col>
          <Col sm="12" lg="6" xl="5" xxl="4">
            {feeds}
          </Col>
        </Row>
        {/***Table ***/}
        <Row>
          <Col lg="12" sm="12">
            {projectTables}
          </Col>
        </Row>
        {/***Blog Cards***/}
        <Row>
          {blogData.map((blg) => (
            <Col sm="6" lg="6" xl="3" key={blg.title}>
              <Blog
                image={blg.image}
                title={blg.title}
                subtitle={blg.subtitle}
                text={blg.description}
                color={blg.btnbg}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default HomeView;
