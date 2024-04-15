import { Col, Divider, Row, Card, Empty, Spin, Carousel } from 'antd';
import styles from 'styles/client.module.scss';
import SearchClient from '@/components/client/search.client';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IFilm } from '@/types/backend';
import { callFetchFilm } from '@/config/api';

import FilmCard from '@/components/client/card/film.card';
import CinemaCard from '@/components/client/card/cinema.card';


const HomePage = () => {
    return (
        <div className={`${styles["container"]} ${styles["home-section"]}`}>
            <div className="search-content" style={{ marginTop: 20 }}>
                <SearchClient />
            </div>
            <Divider />
            <CinemaCard />
            <div style={{ margin: 50 }}></div>
            <Divider />
            <FilmCard />
        </div>
    )
}

export default HomePage;