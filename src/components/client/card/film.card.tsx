import { callFetchFilm } from '@/config/api';
import { LOCATION_LIST, convertSlug, getLocationName } from '@/config/utils';
import { IFilm } from '@/types/backend';
import { ClockCircleOutlined, EnvironmentOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Pagination, Row, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

interface IProps {
    showPagination?: boolean;
}

const FilmCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayFilm, setDisplayFilm] = useState<IFilm[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const navigate = useNavigate();

    useEffect(() => {
        fetchFilm();
    }, [current, pageSize, filter, sortQuery]);

    const fetchFilm = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchFilm(query);
        if (res && res.data) {
            setDisplayFilm(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }



    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    const handleViewDetailFilm = (item: IFilm) => {
        const slug = convertSlug(item.name);
        navigate(`/film/${slug}?id=${item._id}`)
    }

    return (
        <div className={`${styles["card-film-section"]}`}>
            <div className={`${styles["film-content"]}`}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                <span className={styles["title"]}>Phim Mới Nhất</span>
                                {!showPagination &&
                                    <Link to="film">Xem tất cả</Link>
                                }
                            </div>
                        </Col>

                        {displayFilm?.map(item => {
                            return (
                                <Col span={24} md={12} key={item._id}>
                                    <Card size="small" title={null} hoverable
                                        onClick={() => handleViewDetailFilm(item)}
                                    >
                                        <div className={styles["card-film-content"]}>
                                            <div className={styles["card-film-left"]}>
                                                <img
                                                    alt="example"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/film/${item?.logo}`}
                                                />
                                            </div>
                                            <div className={styles["card-film-right"]}>
                                                <div className={styles["film-title"]}>{item.name}</div>
                                                <div className={styles["film-location"]}><ClockCircleOutlined style={{ color: '#58aaab' }} />&nbsp;{item.time}</div>
                                                <div><ThunderboltOutlined style={{ color: 'orange' }} />&nbsp;{(item.genres + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} </div>
                                                <div className={styles["film-updatedAt"]}>{dayjs(item.updatedAt).fromNow()}</div>
                                            </div>
                                        </div>

                                    </Card>
                                </Col>
                            )
                        })}


                        {(!displayFilm || displayFilm && displayFilm.length === 0)
                            && !isLoading &&
                            <div className={styles["empty"]}>
                                <Empty description="Không có dữ liệu" />
                            </div>
                        }
                    </Row>
                    {showPagination && <>
                        <div style={{ marginTop: 30 }}></div>
                        <Row style={{ display: "flex", justifyContent: "center" }}>
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={pageSize}
                                responsive
                                onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                            />
                        </Row>
                    </>}
                </Spin>
            </div>
        </div>
    )
}

export default FilmCard;