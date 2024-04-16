import { callFetchShowtimeById } from "@/config/api";
import { IShowtime } from "@/types/backend";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styles from "../../styles/client.module.scss";
import "../../styles/detail.css";
const ClientShowtimeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [showtimeDetail, setShowtimeDetail] = useState<IShowtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const init = async () => {
      if (id) {
        setIsLoading(true);
        const res = await callFetchShowtimeById(id);
        if (res?.data) {
          setShowtimeDetail(res.data);
        }
        setIsLoading(false);
      }
    };
    init();
  }, [id]);
  const handleSeatClick = (seatId: string) => {
    setSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seatId)) {
        return prevSeats.filter((s) => s !== seatId);
      } else {
        return [...prevSeats, seatId];
      }
    });
  };

  // return (
  //   <div>
  //     <h1>Showtime {id}</h1>
  //     <div className={styles["seats-list"]}>
  //       {showtimeDetail?.seats?.map((seat) => (
  //         <div
  //           key={seat._id}
  //           className={`${styles["seat"]} ${
  //             selectedSeats.includes(seat._id) ? styles["slected"] : ""
  //           }`}
  //           onClick={() => handleSeatClick(seat._id)}
  //         >
  //           {seat._id}
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
  return (
    <div>
      <h1>Phim: {showtimeDetail?.film?.name}</h1>
      <h1>Rạp: {showtimeDetail?.room?.name}</h1>
      <div className="seats-list">
        {showtimeDetail?.seats?.map((seat) => (
          <div
            key={seat._id}
            className={`seat ${
              selectedSeats.includes(seat._id) ? "selected" : ""
            }`}
            onClick={() => handleSeatClick(seat._id)}
          >
            {seat._id}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ClientShowtimeDetailPage;
