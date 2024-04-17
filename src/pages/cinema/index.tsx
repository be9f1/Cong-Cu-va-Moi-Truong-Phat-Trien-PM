import SearchClient from '@/components/client/search.client';
import { Col, Divider, Row } from 'antd';
import styles from 'styles/client.module.scss';
import CinemaCard from "@/components/client/card/cinema.card";

const ClientCinemaPage = (props: any) => {
  return (
    <div className={styles["container"]} style={{ marginTop: 20 }}>
      <Row gutter={[20, 20]}>
        <Col span={24}>{/* <SearchClient /> */}</Col>
        <Divider />
        <Col span={24}>
          <CinemaCard showPagination={true} />
        </Col>
      </Row>
    </div>
  );
};

export default ClientCinemaPage;