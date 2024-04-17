import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { IFilm } from "@/types/backend";
import { callFetchFilmById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton, Tag } from "antd";
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined } from "@ant-design/icons";
import { getLocationName } from "@/config/utils";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)


const ClientFilmDetailPage = (props: any) => {
    const [filmDetail, setFilmDetail] = useState<IFilm | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // film id

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchFilmById(id);
                if (res?.data) {
                    setFilmDetail(res.data)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);

    return (
      <div
        className={`${styles["container"]} ${styles["detail-film-section"]}`}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <Row gutter={[20, 20]}>
            {filmDetail && filmDetail._id && (
              <>
                <Col span={24} md={16}>
                  <div className={styles["header"]}>
                    Phim: {filmDetail.name}
                  </div>
                  <div>
                    <button className={styles["btn-apply"]}>Mua vé</button>
                  </div>
                  <Divider />
                  <div className={styles["genres"]}>
                    {" "}
                    Thể loại:
                    {filmDetail?.genres?.map((item, index) => {
                      return (
                        <Tag key={`${index}-key`} color="gold">
                          {item}
                        </Tag>
                      );
                    })}
                  </div>
                  <div className={styles["time"]}>
                    <DollarOutlined />
                    <span>
                      &nbsp;
                      {(filmDetail.time + "")?.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}{" "}
                      đ
                    </span>
                  </div>
                  {/* <div className={styles["location"]}>
                                    <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{getLocationName(filmDetail)}
                                </div> */}
                  <div>
                    <HistoryOutlined /> {filmDetail.time} phút
                  </div>
                  <Divider />
                  {parse(filmDetail.description)}
                </Col>

                <Col span={24} md={8}>
                  <div className={styles["film"]}>
                    <div>
                      <img
                        width={200}
                        height={200}
                        alt="detail-film"
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/film/${
                          filmDetail.logo
                        }`}
                      />
                    </div>
                  </div>
                </Col>
              </>
            )}
          </Row>
        )}
      </div>
    );
}
export default ClientFilmDetailPage;