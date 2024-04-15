import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IRoom } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import { Button, Popconfirm, Select, Space, Tag, message, notification } from "antd";
import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { callDeleteRoom } from "@/config/api";
import queryString from 'query-string';
import { useNavigate } from "react-router-dom";
import { fetchRoom } from "@/redux/slice/roomSlide";

const RoomPage = () => {
  const tableRef = useRef<ActionType>();

  const isFetching = useAppSelector(state => state.room.isFetching);
  const meta = useAppSelector(state => state.room.meta);
  const rooms = useAppSelector(state => state.room.result);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDeleteRoom = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteRoom(_id);
      if (res && res.data) {
        message.success('Xóa Room thành công');
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

  const columns: ProColumns<IRoom>[] = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      align: "center",
      render: (text, record, index) => {
        return (
          <>
            {(index + 1) + (meta.current - 1) * (meta.pageSize)}
          </>)
      },
      hideInSearch: true,
    },
    {
      title: 'Tên Room',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Loại phòng',
      dataIndex: 'type',
    },
    {
      title: 'Số ghế',
      dataIndex: 'seats',
    },
    {
      title: 'Rạp chiếu',
      dataIndex: ['cinema', 'name'],
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
    {

      title: 'Actions',
      hideInSearch: true,
      width: 50,
      render: (_value, entity, _index, _action) => (
        <Space>
          <EditOutlined
            style={{
              fontSize: 20,
              color: '#ffa500',
            }}
            type=""
            onClick={() => {
              navigate(`/admin/room/upsert?id=${entity._id}`)
            }}
          />

          <Popconfirm
            placement="leftTop"
            title={"Xác nhận xóa room"}
            description={"Bạn có chắc chắn muốn xóa room này ?"}
            onConfirm={() => handleDeleteRoom(entity._id)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <span style={{ cursor: "pointer", margin: "0 10px" }}>
              <DeleteOutlined
                style={{
                  fontSize: 20,
                  color: '#ff4d4f',
                }}
              />
            </span>
          </Popconfirm>
        </Space>
      ),

    },
  ];

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = { ...params };
    if (clone.name) clone.name = `/${clone.name}/i`;
    // if (clone.salary) clone.salary = `/${clone.salary}/i`;
    // if (clone?.level?.length) {
    //     clone.level = clone.level.join(",");
    // }
    if (clone.address) clone.address = `/${clone.address}/i`;
    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === 'ascend' ? "sort=name" : "sort=-name";
    }
    if (sort && sort.address) {
      sortBy = sort.address === 'ascend' ? "sort=address" : "sort=-address";
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

    return temp;
  }

  return (
    <div>
      <DataTable<IRoom>
        actionRef={tableRef}
        headerTitle="Danh sách Rooms"
        rowKey="_id"
        loading={isFetching}
        columns={columns}
        dataSource={rooms}
        request={async (params, sort, filter): Promise<any> => {
          const query = buildQuery(params, sort, filter);
          dispatch(fetchRoom({ query }))
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
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => navigate('upsert')}
            >
              Thêm mới
            </Button>
          );
        }}
      />
    </div>
  )
}

export default RoomPage;