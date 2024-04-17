import { useEffect, useRef, useState } from 'react';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import NotFound from 'components/share/not.found';
import Loading from 'components/share/loading';
import LoginPage from 'pages/auth/login';
import RegisterPage from 'pages/auth/register';
import LayoutAdmin from 'components/admin/layout.admin';
import ProtectedRoute from 'components/share/protected-route.ts';
import Header from 'components/client/header.client';
import Footer from 'components/client/footer.client';
import HomePage from 'pages/home';
import styles from 'styles/app.module.scss';
import DashboardPage from './pages/admin/dashboard';
import FilmPage from './pages/admin/film';
import PermissionPage from './pages/admin/permission';
import TicketPage from './pages/admin/ticket';
import RolePage from './pages/admin/role';
import UserPage from './pages/admin/user';
import { fetchAccount } from './redux/slice/accountSlide';
import LayoutApp from './components/share/layout.app';
import CinemaPage from './pages/admin/cinema';
import ViewUpsertCinema from './components/admin/cinema/upsert.cinema';
import ClientCinemaDetailPage from "./pages/cinema/detail";
import ClientFilmDetailPage from "./pages/film/detail";
import ViewUpsertRoom from "./components/admin/room/upsert.room";
import RoomPage from "./pages/admin/room";
import ShowtimePage from "./pages/admin/showtime";
import ViewUpsertShowtime from "./components/admin/showtimes/upsert.showtime";
import ClientShowtimeDetailPage from "./pages/showtime/detail";
import ClientFilmPage from "./pages/film";
import ClientCinemaPage from "./pages/cinema";
import ClientShowtimePage from "./pages/showtime";

const LayoutClient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef && rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="layout-app" ref={rootRef}>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className={styles["content-app"]}>
        <Outlet context={[searchTerm, setSearchTerm]} />
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.account.isLoading);

  useEffect(() => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    )
      return;
    dispatch(fetchAccount());
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <LayoutApp>
          <LayoutClient />
        </LayoutApp>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "cinema", element: <ClientCinemaPage /> },
        { path: "cinema/:id", element: <ClientCinemaDetailPage /> },
        { path: "film", element: <ClientFilmPage /> },
        { path: "film/:id", element: <ClientFilmDetailPage /> },
        { path: "showtime", element: <ClientShowtimePage /> },
        { path: "showtime/:id", element: <ClientShowtimeDetailPage /> },
      ],
    },

    {
      path: "/admin",
      element: (
        <LayoutApp>
          <LayoutAdmin />{" "}
        </LayoutApp>
      ),
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "film",
          element: (
            <ProtectedRoute>
              <FilmPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "user",
          element: (
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          ),
        },

        {
          path: "cinema",
          children: [
            {
              index: true,
              element: (
                <ProtectedRoute>
                  {" "}
                  <CinemaPage />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: "room",
          children: [
            {
              index: true,
              element: (
                <ProtectedRoute>
                  {" "}
                  <RoomPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "upsert",
              element: (
                <ProtectedRoute>
                  <ViewUpsertRoom />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: "showtime",
          children: [
            {
              index: true,
              element: (
                <ProtectedRoute>
                  {" "}
                  <ShowtimePage />
                </ProtectedRoute>
              ),
            },
            {
              path: "upsert",
              element: (
                <ProtectedRoute>
                  <ViewUpsertShowtime />
                </ProtectedRoute>
              ),
            },
          ],
        },

        {
          path: "permission",
          element: (
            <ProtectedRoute>
              <PermissionPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "role",
          element: (
            <ProtectedRoute>
              <RolePage />
            </ProtectedRoute>
          ),
        },
      ],
    },

    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}