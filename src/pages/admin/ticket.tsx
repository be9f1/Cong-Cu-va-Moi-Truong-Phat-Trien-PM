import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ITicket } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import { Button, Popconfirm, Select, Space, Tag, message, notification } from "antd";
import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { callDeleteTicket } from "@/config/api";
import queryString from 'query-string';
import { useNavigate } from "react-router-dom";
import { fetchTicket } from "@/redux/slice/ticketSlide";
import ViewDetailTicket from "@/components/admin/ticket/view.ticket";


const TicketPage = () => {
    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.ticket.isFetching);
    const meta = useAppSelector(state => state.ticket.meta);
    const tickets = useAppSelector(state => state.ticket.result);
    const dispatch = useAppDispatch();

    const [dataInit, setDataInit] = useState<ITicket | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    const handleDeleteTicket = async (_id: string | undefined) => {
        if (_id) {
            const res = await callDeleteTicket(_id);
            if (res && res.data) {
                message.success('Xóa Ticket thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<ITicket>[] = [
        {
            title: 'Id',
            dataIndex: '_id',
            width: 250,
            render: (text, record, index, action) => {
                return (
                    <a href="#" onClick={() => {
                        setOpenViewDetail(true);
                        setDataInit(record);
                    }}>
                        {record._id}
                    </a>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            sorter: true,
            renderFormItem: (item, props, form) => (
                <ProFormSelect
                    showSearch
                    mode="multiple"
                    allowClear
                    valueEnum={{
                        PENDING: 'PENDING',
                        REVIEWING: 'REVIEWING',
                        APPROVED: 'APPROVED',
                        REJECTED: 'REJECTED',
                    }}
                    placeholder="Chọn trạng thái"
                />
            ),
        },

        {
            title: 'Film',
            dataIndex: ["filmId", "name"],
            hideInSearch: true,
        },
        {
            title: 'Room',
            dataIndex: ["roomId", "name"],
            hideInSearch: true,
        },

        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'UpdatedAt',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
        // {

        //     title: 'Actions',
        //     hideInSearch: true,
        //     width: 50,
        //     render: (_value, entity, _index, _action) => (
        //         <Space>
        //             <EditOutlined
        //                 style={{
        //                     fontSize: 20,
        //                     color: '#ffa500',
        //                 }}
        //                 type=""
        //                 onClick={() => {
        //                     navigate(`/admin/job/upsert?id=${entity._id}`)
        //                 }}
        //             />

        //             <Popconfirm
        //                 placement="leftTop"
        //                 title={"Xác nhận xóa ticket"}
        //                 description={"Bạn có chắc chắn muốn xóa ticket này ?"}
        //                 onConfirm={() => handleDeleteTicket(entity._id)}
        //                 okText="Xác nhận"
        //                 cancelText="Hủy"
        //             >
        //                 <span style={{ cursor: "pointer", margin: "0 10px" }}>
        //                     <DeleteOutlined
        //                         style={{
        //                             fontSize: 20,
        //                             color: '#ff4d4f',
        //                         }}
        //                     />
        //                 </span>
        //             </Popconfirm>
        //         </Space>
        //     ),

        // },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        // if (clone.name) clone.name = `/${clone.name}/i`;
        // if (clone.salary) clone.salary = `/${clone.salary}/i`;
        if (clone?.status?.length) {
            clone.status = clone.status.join(",");
        }

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.status) {
            sortBy = sort.status === 'ascend' ? "sort=status" : "sort=-status";
        }

        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt" : "sort=-createdAt";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt" : "sort=-updatedAt";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=-updatedAt`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        temp += "&populate=roomId,filmId&fields=roomId._id, roomId.name, filmId._id, filmId.name";
        return temp;
    }

    return (
        <div>
            <DataTable<ITicket>
                actionRef={tableRef}
                headerTitle="Danh sách Tickets"
                rowKey="_id"
                loading={isFetching}
                columns={columns}
                dataSource={tickets}
                request={async (params, sort, filter): Promise<any> => {
                    const query = buildQuery(params, sort, filter);
                    dispatch(fetchTicket({ query }))
                }}
                scroll={{ x: true }}
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }
                rowSelection={false}
                toolBarRender={(_action, _rows): any => {
                    return (
                        <></>
                    );
                }}
            />
            <ViewDetailTicket
                open={openViewDetail}
                onClose={setOpenViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={reloadTable}
            />
        </div>
    )
}

export default TicketPage;