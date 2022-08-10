import React from "react";
import { Button, Typography, Row, Col, Card, Divider } from "antd";
import { ChatCategory } from "../../../Config";
const { Meta } = Card;
function LandingPage() {
  const renderCard = ChatCategory.map((chatcg, index) => {
    return (
      <Col lg={8} md={12} xs={24} key={index}>
        <a href={`/${chatcg.label}`}>
          <Card
            hoverable
            cover={<img src={`${chatcg.imageUrl}`} alt="이미지" />}
          >
            <Meta title={chatcg.name} description={chatcg.description} />
          </Card>
        </a>
      </Col>
    );
  });
  return (
    <div style={{ margin: "4rem auto", width: "80%" }}>
      <div>
        <h2>Hello Everyone</h2>
      </div>
      <Divider />

      <Row gutter={[32, 32]}>{renderCard}</Row>
    </div>
  );
}

export default LandingPage;
