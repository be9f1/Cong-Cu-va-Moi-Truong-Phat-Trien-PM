import {
  Breadcrumb,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Row,
  message,
  notification,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DebounceSelect } from "../user/debouce.select";
import {
  FooterToolbar,
  ProForm,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from "@ant-design/pro-components";
import styles from "styles/admin.module.scss";
import { LOCATION_LIST, SKILLS_LIST } from "@/config/utils";
import {
  ICinemaSelect,
  IFilmSelect,
  IFilmSelect1,
  IRoomSelect,
} from "../user/modal.user";
import { useState, useEffect } from "react";
import {
  callCreateShowtime,
  callFetchCinema,
  callFetchFilm,
  callFetchRoom,
  callFetchShowtimeById,
  callUpdateShowtime,
} from "@/config/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CheckSquareOutlined } from "@ant-design/icons";
import enUS from "antd/lib/locale/en_US";
import dayjs from "dayjs";
import { IShowtime } from "@/types/backend";

const ViewUpsertShowtime = (props: any) => {
  const [rooms, setRooms] = useState<IRoomSelect[]>([]);
  const [films, setFilms] = useState<IFilmSelect1[]>([]);
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
  const navigate = useNavigate();
  const [value, setValue] = useState<string>("");

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get("id"); // showtime id
  const [dataUpdate, setDataUpdate] = useState<IShowtime | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const init = async () => {
      if (id) {
        const res = await callFetchShowtimeById(id);
        if (res && res.data) {
          setDataUpdate(res.data);
          setRooms([
            {
              label: res.data.room?.name as string,
              key: res.data.room?._id,
            },
          ]);
          setFilms([
            {
              value: res.data.film?.time as number,
              label: res.data.film?.name as string,
              key: res.data.film?._id,
            },
          ]);

          form.setFieldsValue({
            ...res.data,
            cinema: {
              label: res.data.room?.name as string,
              key: res.data.room?._id,
            },
          });
        }
      }
    };
    init();
    return () => form.resetFields();
  }, [id]);

  const onFinish = async (values: any) => {
    const { film, room, dateStart } = values;
    if (dataUpdate?._id) {
      //update
      const cp = values?.film?.value?.split("@#$");
      const showtime = {
        _id: dataUpdate._id,
        film: {
          _id: film.key,
          name: film.label,
          time: film.value,
        },
        dateStart,
        room: {
          _id: room.key,
          name: room.label,
        },
      };

      const res = await callUpdateShowtime(showtime, dataUpdate._id);
      if (res.data) {
        message.success("Cập nhật showtime thành công");
        navigate("/admin/showtime");
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    } else {
      //create
      const showtime = {
        film: {
          _id: film.key,
          name: film.label,
          time: film.value,
        },
        dateStart,
        room: {
          _id: room.key,
          name: room.label,
        },
      };

      const res = await callCreateShowtime(showtime);
      if (res.data) {
        message.success("Tạo mới showtime thành công");
        navigate("/admin/showtime");
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    }
  };

  async function fetchCinemaList(name: string): Promise<ICinemaSelect[]> {
    const res = await callFetchCinema(`current=1&pageSize=100&name=/${name}/i`);
    if (res && res.data) {
      const list = res.data.result;
      const temp = list.map((item) => {
        return {
          label: item.name as string,
          value: item._id as string,
        };
      });
      return temp;
    } else return [];
  }

  async function fetchFilmList(name: string): Promise<ICinemaSelect[]> {
    const res = await callFetchFilm(`current=1&pageSize=100&name=/${name}/i`);
    if (res && res.data) {
      const list = res.data.result;
      const temp = list.map((item) => {
        return {
          label: item.name as string,
          key: item._id as string,
          value: item.time as number,
        };
      });
      return temp;
    } else return [];
  }

  async function fetchRoomList(name: string): Promise<IRoomSelect[]> {
    const res = await callFetchRoom(`current=1&pageSize=100&name=/${name}/i`);
    if (res && res.data) {
      const list = res.data.result;
      const temp = list.map((item) => {
        return {
          label: item.name as string,
          value: item._id as string,
        };
      });
      return temp;
    } else return [];
  }

  return (
    <div className={styles["upsert-showtime-container"]}>
      <div className={styles["title"]}>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to="/admin/showtime">Manage Showtime</Link>,
            },
            {
              title: "Upsert Showtime",
            },
          ]}
        />
      </div>
      <div>
        <ConfigProvider locale={enUS}>
          <ProForm
            form={form}
            onFinish={onFinish}
            submitter={{
              searchConfig: {
                resetText: "Hủy",
                submitText: (
                  <>
                    {dataUpdate?._id ? "Cập nhật Showtime" : "Tạo mới Showtime"}
                  </>
                ),
              },
              onReset: () => navigate("/admin/showtime"),
              render: (_: any, dom: any) => (
                <FooterToolbar>{dom}</FooterToolbar>
              ),
              submitButtonProps: {
                icon: <CheckSquareOutlined />,
              },
            }}
          >
            <Row gutter={[20, 20]}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <ProForm.Item
                  name="room"
                  label="Thuộc phòng chiếu"
                  rules={[
                    { required: true, message: "Vui lòng chọn rạp chiếu!" },
                  ]}
                >
                  <DebounceSelect
                    allowClear
                    showSearch
                    defaultValue={rooms}
                    value={rooms}
                    placeholder="Chọn phòng chiếu"
                    fetchOptions={fetchRoomList}
                    onChange={(newValue: any) => {
                      if (newValue?.length === 0 || newValue?.length === 1) {
                        setRooms(newValue as IFilmSelect[]);
                      }
                    }}
                    style={{ width: "100%" }}
                  />
                </ProForm.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <ProForm.Item
                  name="film"
                  label="Thuộc phim"
                  rules={[{ required: true, message: "Vui lòng chọn phim!" }]}
                >
                  <DebounceSelect
                    allowClear
                    showSearch
                    defaultValue={films}
                    value={films}
                    placeholder="Chọn phim"
                    fetchOptions={fetchFilmList}
                    onChange={(newValue: any) => {
                      if (newValue?.length === 0 || newValue?.length === 1) {
                        setRooms(newValue as IFilmSelect[]);
                      }
                    }}
                    style={{ width: "100%" }}
                  />
                </ProForm.Item>
              </Col>
              <Col span={24} md={6}>
                <ProFormDateTimePicker
                  label="Giờ khởi chiếu"
                  name="dateStart"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày và giờ khởi chiếu",
                    },
                  ]}
                  placeholder="YYYY-MM-DD HH:mm:ss"
                />
              </Col>
            </Row>

            <Divider />
          </ProForm>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default ViewUpsertShowtime;
