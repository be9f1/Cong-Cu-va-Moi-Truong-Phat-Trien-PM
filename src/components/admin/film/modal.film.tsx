import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { FooterToolbar, ModalForm, ProCard, ProForm, ProFormDatePicker, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, ConfigProvider, Form, Modal, Row, Upload, message, notification } from "antd";
import 'styles/reset.scss';
import { isMobile } from 'react-device-detect';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import { callCreateFilm, callFetchCinema, callFetchFilmById, callUpdateFilm, callUploadSingleFile } from "@/config/api";
import { IFilm } from "@/types/backend";
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';
import dayjs from 'dayjs';
import { ICinemaSelect } from "../user/modal.user";
import { DebounceSelect } from "../user/debouce.select";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IFilm | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface IFilmForm {
    name: string;
    actors: string[];
    genres: string[];
    director: string;
    description: string;
    strartDate: Date;
    endDate: Date;
}

interface IFilmLogo {
    name: string;
    uid: string;
}

const ModalFilm = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

    //modal animation
    const [animation, setAnimation] = useState<string>('open');

    const [cinemas, setCinemas] = useState<ICinemaSelect[]>([]);
    const [dataUpdate, setDataUpdate] = useState<IFilm | null>(null);
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // film id

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [dataLogo, setDataLogo] = useState<IFilmLogo[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [value, setValue] = useState<string>("");
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?._id && dataInit?.description) {
            setValue(dataInit.description);
        }
    }, [dataInit])

    const submitFilm = async (values: any) => {


        if (dataLogo.length === 0) {
            message.error('Vui lòng upload ảnh Logo')
            return;
        }

        if (dataInit?._id) {
            //update
            const film = {
                name: values.name,
                actors: values.actors,
                genres: values.genres,
                time: values.time,
                director: value,
                description: values.description,
                logo: dataLogo[0].name,
                startDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.startDate) ? dayjs(values.startDate, 'DD/MM/YYYY').toDate() : values.startDate,
                endDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.endDate) ? dayjs(values.endDate, 'DD/MM/YYYY').toDate() : values.endDate,
                isActive: values.isActive
            }
            const res = await callUpdateFilm(film, dataInit._id);
            if (res.data) {
                message.success("Cập nhật film thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const film = {
                name: values.name,
                actors: values.actors,
                genres: values.genres,
                director: values.director,
                time: values.time,
                description: value,
                logo: dataLogo[0].name,
                startDate: dayjs(values.startDate, 'DD/MM/YYYY').toDate(),
                endDate: dayjs(values.endDate, 'DD/MM/YYYY').toDate(),
                isActive: values.isActive
            }
            const res = await callCreateFilm(film);
            if (res.data) {
                message.success("Thêm mới film thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setValue("");
        setDataInit(null);

        //add animation when closing modal
        setAnimation('close')
        await new Promise(r => setTimeout(r, 400))
        setOpenModal(false);
        setAnimation('open')
    }

    const handleRemoveFile = (file: any) => {
        setDataLogo([])
    }

    const handlePreview = async (file: any) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url: string) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
        }
    };

    const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, "film");
        if (res && res.data) {
            setDataLogo([{
                name: res.data.fileName,
                uid: uuidv4()
            }])
            if (onSuccess) onSuccess('ok')
        } else {
            if (onError) {
                setDataLogo([])
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };


    return (
        <>
            {openModal &&
                <>
                    <ModalForm
                        title={<>{dataInit?._id ? "Cập nhật Film" : "Tạo mới Film"}</>}
                        open={openModal}
                        modalProps={{
                            onCancel: () => { handleReset() },
                            afterClose: () => handleReset(),
                            destroyOnClose: true,
                            width: isMobile ? "100%" : 900,
                            footer: null,
                            keyboard: false,
                            maskClosable: false,
                            className: `modal-film ${animation}`,
                            rootClassName: `modal-film-root ${animation}`
                        }}
                        scrollToFirstError={true}
                        preserve={false}
                        form={form}
                        onFinish={submitFilm}
                        initialValues={dataInit?._id ? dataInit : {}}
                        submitter={{
                            render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                            submitButtonProps: {
                                icon: <CheckSquareOutlined />
                            },
                            searchConfig: {
                                resetText: "Hủy",
                                submitText: <>{dataInit?._id ? "Cập nhật" : "Tạo mới"}</>,
                            }
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={24}>
                                <ProFormText
                                    label="Tên phim"
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập tên phim"
                                />
                            </Col>

                            <Col span={10}>
                                <ProFormTextArea
                                    label="Đạo diễn"
                                    name="director"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập đạo diễn phim"
                                    fieldProps={{
                                        autoSize: { minRows: 1 }
                                    }}
                                />
                            </Col>
                            <Col span={10}>
                                <ProFormTextArea
                                    label="Diễn viên"
                                    name="actors"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập diễn viên phim"
                                    fieldProps={{
                                        autoSize: { minRows: 1 }
                                    }}
                                    normalize={(value) => value.split(',').map((item: string) => item.trim())}
                                />
                            </Col>
                            <Col span={10}>
                                <ProFormTextArea
                                    label="Thể loại"
                                    name="genres"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập thể loại phim"
                                    fieldProps={{
                                        autoSize: { minRows: 1 }
                                    }}
                                    normalize={(value) => value.split(',').map((item: string) => item.trim())}
                                />
                            </Col>
                            <Col span={10}>
                                <ProFormTextArea
                                    label="Thời lượng"
                                    name="time"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập thời lượng phim"
                                    fieldProps={{
                                        autoSize: { minRows: 1 }
                                    }}
                                />
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Ảnh Logo"
                                    name="logo"
                                    rules={[{
                                        required: true,
                                        message: 'Vui lòng không bỏ trống',
                                        validator: () => {
                                            if (dataLogo.length > 0) return Promise.resolve();
                                            else return Promise.reject(false);
                                        }
                                    }]}
                                >
                                    <ConfigProvider locale={enUS}>
                                        <Upload
                                            name="logo"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            maxCount={1}
                                            multiple={false}
                                            customRequest={handleUploadFileLogo}
                                            beforeUpload={beforeUpload}
                                            onChange={handleChange}
                                            onRemove={(file) => handleRemoveFile(file)}
                                            onPreview={handlePreview}
                                            defaultFileList={
                                                dataInit?._id ?
                                                    [
                                                        {
                                                            uid: uuidv4(),
                                                            name: dataInit?.logo ?? "",
                                                            status: 'done',
                                                            url: `${import.meta.env.VITE_BACKEND_URL}/images/film/${dataInit?.logo}`,
                                                        }
                                                    ] : []
                                            }

                                        >
                                            <div>
                                                {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        </Upload>
                                    </ConfigProvider>
                                </Form.Item>

                            </Col>


                        </Row>
                        <ConfigProvider locale={enUS}>
                            <Row gutter={[20, 20]}>
                                <Col span={24} md={6}>
                                    <ProFormDatePicker
                                        label="Ngày bắt đầu"
                                        name="startDate"
                                        normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                                        fieldProps={{
                                            format: 'DD/MM/YYYY',

                                        }}
                                        rules={[{ required: true, message: 'Vui lòng chọn ngày cấp' }]}
                                        placeholder="dd/mm/yyyy"
                                    />
                                </Col>
                                <Col span={24} md={6}>
                                    <ProFormDatePicker
                                        label="Ngày kết thúc"
                                        name="endDate"
                                        normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                                        fieldProps={{
                                            format: 'DD/MM/YYYY',

                                        }}
                                        // width="auto"
                                        rules={[{ required: true, message: 'Vui lòng chọn ngày cấp' }]}
                                        placeholder="dd/mm/yyyy"
                                    />
                                </Col>
                                <Col span={24} md={6}>
                                    <ProFormSwitch
                                        label="Trạng thái"
                                        name="isActive"
                                        checkedChildren="ACTIVE"
                                        unCheckedChildren="INACTIVE"
                                        initialValue={true}
                                        fieldProps={{
                                            defaultChecked: true,
                                        }}
                                    />
                                </Col>
                                <Col span={24}>
                                    <ProForm.Item
                                        name="description"
                                        label="Miêu tả phim"
                                        rules={[{ required: true, message: 'Vui lòng nhập miêu tả cinema!' }]}
                                    >
                                        <ReactQuill
                                            theme="snow"
                                            value={value}
                                            onChange={setValue}
                                        />
                                    </ProForm.Item>
                                </Col>


                            </Row>
                        </ConfigProvider>

                    </ModalForm>
                    <Modal
                        open={previewOpen}
                        title={previewTitle}
                        footer={null}
                        onCancel={() => setPreviewOpen(false)}
                        style={{ zIndex: 1500 }}
                    >
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </>
            }
        </>
    )
}

export default ModalFilm;
