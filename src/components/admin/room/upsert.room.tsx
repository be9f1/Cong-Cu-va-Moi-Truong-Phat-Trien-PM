import { Breadcrumb, Col, ConfigProvider, Divider, Form, Row, message, notification } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DebounceSelect } from "../user/debouce.select";
import { FooterToolbar, ProForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from "@ant-design/pro-components";
import styles from 'styles/admin.module.scss';
import { LOCATION_LIST, SKILLS_LIST } from "@/config/utils";
import { ICinemaSelect, IFilmSelect } from "../user/modal.user";
import { useState, useEffect } from 'react';
import { callCreateRoom, callFetchCinema, callFetchFilm, callFetchRoomById, callUpdateRoom } from "@/config/api";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CheckSquareOutlined } from "@ant-design/icons";
import enUS from 'antd/lib/locale/en_US';
import dayjs from 'dayjs';
import { IRoom } from "@/types/backend";

const ViewUpsertRoom = (props: any) => {
    const [cinemas, setCinemas] = useState<ICinemaSelect[]>([]);
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const navigate = useNavigate();
    const [value, setValue] = useState<string>("");

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // room id
    const [dataUpdate, setDataUpdate] = useState<IRoom | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const init = async () => {
            if (id) {
                const res = await callFetchRoomById(id);
                if (res && res.data) {
                    setDataUpdate(res.data);
                    setCinemas([
                        {
                            label: res.data.cinema?.name as string,
                            key: res.data.cinema?._id
                        }
                    ])

                    form.setFieldsValue({
                        ...res.data,
                        cinema: {
                            label: res.data.cinema?.name as string,
                            key: res.data.cinema?._id
                        },

                    })
                }
            }
        }
        init();
        return () => form.resetFields()
    }, [id])


    const onFinish = async (values: any) => {
        const { name, type, seats, cinema } = values;
        if (dataUpdate?._id) {
            //update
            const cp = values?.film?.value?.split('@#$');
            const room = {
                _id: dataUpdate._id,
                name,
                type,
                seats,
                cinema: {
                    _id: cinema.key,
                    name: cinema.label
                },

            }

            const res = await callUpdateRoom(room, dataUpdate._id);
            if (res.data) {
                message.success("Cập nhật room thành công");
                navigate('/admin/room')
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const room = {
                name,
                type,
                seats,
                cinema: {
                    _id: cinema.key,
                    name: cinema.label
                },
            }

            const res = await callCreateRoom(room);
            if (res.data) {
                message.success("Tạo mới room thành công");
                navigate('/admin/room')
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    async function fetchCinemaList(name: string): Promise<ICinemaSelect[]> {
        const res = await callFetchCinema(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item._id as string
                }
            })
            return temp;
        } else return [];
    }

    return (
        <div className={styles["upsert-room-container"]}>
            <div className={styles["title"]}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to="/admin/room">Manage Room</Link>,
                        },
                        {
                            title: 'Upsert Room',
                        },
                    ]}
                />
            </div>
            <div >

                <ConfigProvider locale={enUS}>
                    <ProForm
                        form={form}
                        onFinish={onFinish}
                        submitter={
                            {
                                searchConfig: {
                                    resetText: "Hủy",
                                    submitText: <>{dataUpdate?._id ? "Cập nhật Room" : "Tạo mới Room"}</>
                                },
                                onReset: () => navigate('/admin/room'),
                                render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                                submitButtonProps: {
                                    icon: <CheckSquareOutlined />
                                },
                            }
                        }
                    >
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={12}>
                                <ProFormText
                                    label="Tên Room"
                                    name="name"
                                    rules={[
                                        { required: true, message: 'Vui lòng không bỏ trống' },
                                    ]}
                                    placeholder="Nhập tên Room"
                                />
                            </Col>
                            <Col span={24} md={12}>
                                <ProFormText
                                    label="Loại phòng"
                                    name="type"
                                    rules={[
                                        { required: true, message: 'Vui lòng không bỏ trống' },
                                    ]}
                                    placeholder="Nhập loại phòng"
                                />
                            </Col>
                            <Col span={24} md={12}>
                                <ProFormText
                                    label="Số ghế"
                                    name="seats"
                                    rules={[
                                        { required: true, message: 'Vui lòng không bỏ trống' },
                                    ]}
                                    placeholder="Nhập số ghế"
                                />
                            </Col>

                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProForm.Item
                                    name="cinema"
                                    label="Thuộc rạp chiếu"
                                    rules={[{ required: true, message: 'Vui lòng chọn rạp chiếu!' }]}
                                >
                                    <DebounceSelect
                                        allowClear
                                        showSearch
                                        defaultValue={cinemas}
                                        value={cinemas}
                                        placeholder="Chọn rạp chiếu"
                                        fetchOptions={fetchCinemaList}
                                        onChange={(newValue: any) => {
                                            if (newValue?.length === 0 || newValue?.length === 1) {
                                                setCinemas(newValue as IFilmSelect[]);
                                            }
                                        }}
                                        style={{ width: '100%' }}
                                    />
                                </ProForm.Item>

                            </Col>

                        </Row>

                        <Divider />
                    </ProForm>
                </ConfigProvider>

            </div>
        </div>
    )
}

export default ViewUpsertRoom;