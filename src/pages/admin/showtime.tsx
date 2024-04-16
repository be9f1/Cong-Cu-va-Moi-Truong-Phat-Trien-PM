import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IShowtime } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ActionType,
  ProColumns,
  ProFormSelect,
} from "@ant-design/pro-components";
import {
  Button,
  Popconfirm,
  Select,
  Space,
  Tag,
  message,
  notification,
} from "antd";
import { useState, useRef } from "react";
import dayjs from "dayjs";
import { callDeleteShowtime } from "@/config/api";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { fetchShowtime } from "@/redux/slice/showtimeSlide";

const ShowtimePage = () => {
  const tableRef = useRef<ActionType>();

  const isFetching = useAppSelector((state) => state.showtime.isFetching);
  const meta = useAppSelector((state) => state.showtime.meta);
  const showtimes = useAppSelector((state) => state.showtime.result);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDeleteShowtime = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteShowtime(_id);
      if (res && res.data) {
        message.success("Xóa Showtime thành công");
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    }
  };

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const columns: ProColumns<IShowtime>[] = [
    {
      title: "STT",
      key: "index",
      width: 50,
      align: "center",
      render: (text, record, index) => {
        return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>;
      },
      hideInSearch: true,
    },
    {
      title: "Showtime",
      dataIndex: "_id",
      sorter: true,
    },
    {
      title: "Phim chiếu",
      dataIndex: ["film", "name"],
    },
    {
      title: "Phòng chiếu",
      dataIndex: ["room", "name"],
    },
    {
      title: "Ngày giờ chiếu",
      dataIndex: "dateStart",
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      width: 200,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
      hideInSearch: true,
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
      width: 200,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
      hideInSearch: true,
    },
    {
      title: "Actions",
      hideInSearch: true,
      width: 50,
      render: (_value, entity, _index, _action) => (
        <Space>
          <EditOutlined
            style={{
              fontSize: 20,
              color: "#ffa500",
            }}
            type=""
            onClick={() => {
              navigate(`/admin/showtime/upsert?id=${entity._id}`);
            }}
          />

          <Popconfirm
            placement="leftTop"
            title={"Xác nhận xóa showtime"}
            description={"Bạn có chắc chắn muốn xóa showtime này ?"}
            onConfirm={() => handleDeleteShowtime(entity._id)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <span style={{ cursor: "pointer", margin: "0 10px" }}>
              <DeleteOutlined
                style={{
                  fontSize: 20,
                  color: "#ff4d4f",
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
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.address) {
      sortBy = sort.address === "ascend" ? "sort=address" : "sort=-address";
    }
    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === "ascend" ? "sort=createdAt" : "sort=-createdAt";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend" ? "sort=updatedAt" : "sort=-updatedAt";
    }

    //mặc định sort theo updatedAt
    if (Object.keys(sortBy).length === 0) {
      temp = `${temp}&sort=-updatedAt`;
    } else {
      temp = `${temp}&${sortBy}`;
    }

    return temp;
  };

  return (
    <div>
      <DataTable<IShowtime>
        actionRef={tableRef}
        headerTitle="Danh sách Showtimes"
        rowKey="_id"
        loading={isFetching}
        columns={columns}
        dataSource={showtimes}
        request={async (params, sort, filter): Promise<any> => {
          const query = buildQuery(params, sort, filter);
          dispatch(fetchShowtime({ query }));
        }}
        scroll={{ x: true }}
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {" "}
                {range[0]}-{range[1]} trên {total} rows
              </div>
            );
          },
        }}
        rowSelection={false}
        toolBarRender={(_action, _rows): any => {
          return (
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => navigate("upsert")}
            >
              Thêm mới
            </Button>
          );
        }}
      />
    </div>
  );
};

export default ShowtimePage;
