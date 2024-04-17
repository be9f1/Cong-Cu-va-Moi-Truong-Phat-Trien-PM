import { callFetchShowtimeById } from "@/config/api";
import { IShowtime } from "@/types/backend";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styles from "../../styles/client.module.scss";
import { io } from "socket.io-client";

const ClientShowtimeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [total, setTotal] = useState(0);
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
    const seat = showtimeDetail?.seats?.find((seat) => seat._id === seatId);
    const seatPrice = seat?.price || 0;

    setSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seatId)) {
        // Seat is being unselected, subtract its price from the total
        setTotal((total) => total - seatPrice);
        return prevSeats.filter((s) => s !== seatId);
      } else {
        // Seat is being selected, add its price to the total
        setTotal((total) => total + seatPrice);
        return [...prevSeats, seatId];
      }
    });
  };
  // useEffect(() => {
  //   socket.on("seatSelected", (seatId) => {
  //     const seat = showtimeDetail?.seats?.find((seat) => seat._id === seatId);
  //     const seatPrice = seat?.price || 0;
  //     setTotal((total) => total + seatPrice);
  //     setSelectedSeats((prevSeats) => [...prevSeats, seatId]);
  //     setShowtimeDetail((prevDetail) => {
  //       return {
  //         ...prevDetail,
  //         seats: prevDetail?.seats?.map((seat) =>
  //           seat._id === seatId ? { ...seat, status: "SELECTED" } : seat
  //         ),
  //       };
  //     });
  //   });

  //   socket.on("seatUnselected", (seatId) => {
  //     const seat = showtimeDetail?.seats?.find((seat) => seat._id === seatId);
  //     const seatPrice = seat?.price || 0;
  //     setTotal((total) => total - seatPrice);
  //     setSelectedSeats((prevSeats) => prevSeats.filter((s) => s !== seatId));
  //     setShowtimeDetail((prevDetail) => {
  //       return {
  //         ...prevDetail,
  //         seats: prevDetail?.seats?.map((seat) =>
  //           seat._id === seatId ? { ...seat, status: "READY" } : seat
  //         ),
  //       };
  //     });
  //   });

  //   return () => {
  //     socket.off("seatSelected");
  //     socket.off("seatUnselected");
  //   };
  // }, [showtimeDetail]);

  // const handleSeatClick = (seatId: string) => {
  //   const seat = showtimeDetail?.seats?.find((seat) => seat._id === seatId);
  //   const seatPrice = seat?.price || 0;

  //   if (selectedSeats.includes(seatId)) {
  //     // Seat is being unselected, subtract its price from the total
  //     setTotal((total) => total - seatPrice);
  //     setSelectedSeats((prevSeats) => prevSeats.filter((s) => s !== seatId));
  //     socket.emit("seatUnselected", seatId);
  //     setShowtimeDetail((prevDetail) => {
  //       return {
  //         ...prevDetail,
  //         seats: prevDetail?.seats?.map((seat) =>
  //           seat._id === seatId ? { ...seat, status: "READY" } : seat
  //         ),
  //       };
  //     });
  //   } else {
  //     // Seat is being selected, add its price to the total
  //     setTotal((total) => total + seatPrice);
  //     setSelectedSeats((prevSeats) => [...prevSeats, seatId]);
  //     socket.emit("seatSelected", seatId);
  //     setShowtimeDetail((prevDetail) => {
  //       return {
  //         ...prevDetail,
  //         seats: prevDetail?.seats?.map((seat) =>
  //           seat._id === seatId ? { ...seat, status: "SELECTED" } : seat
  //         ),
  //       };
  //     });
  //   }
  // };
  return (
    <div>
      <h1>Phim: {showtimeDetail?.film?.name}</h1>
      <h1>Rạp: {showtimeDetail?.room?.name}</h1>
      <h1>Giá tiền: {total}</h1>
      <div className={styles["seats-list"]}>
        {showtimeDetail?.seats?.slice(0, 50).map((seat) => (
          <div
            key={seat._id}
            className={`${styles["seat"]} ${
              selectedSeats.includes(seat._id)
                ? styles["selected"]
                : seat.status === "READY"
                ? styles["ready"]
                : styles["unready"]
            }`}
            onClick={() => seat.status === "READY" && handleSeatClick(seat._id)}
          >
            {seat._id}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ClientShowtimeDetailPage;
