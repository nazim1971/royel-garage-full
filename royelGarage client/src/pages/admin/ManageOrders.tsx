import { Table, TableColumnsType, TableProps } from "antd";
import { useGetAllSemestersQuery } from "../../../redux/features/admin/academicManagement.api";
import { useState } from "react";
import { monthNames } from "../../../consts/Academic Semester/monthNames";
import { TQueryParam } from "../../../types/globel";

interface DataType {
  key?: React.Key;
  name: string;
  startMonth: string;
  endMonth: string;
  year: string;
}

const ManageOrder = () => {

  const [params, setParams] = useState<TQueryParam[] | undefined>(undefined);

  const { data: semesterData, isFetching } = useGetAllSemestersQuery(params);
  console.log(semesterData);

  const tableData  = semesterData?.data?.map(
    ({ _id, name, startMonth, endMonth, year }) => ({
      key:_id,
      name,
      startMonth,
      endMonth,
      year
    })
  ) || [];

  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      key:'name',
      dataIndex: "name",
      filters: [
        {
          text: "Autumn",
          value: "Autumn",
        },
        {
          text: "Fall",
          value: "Fall",
        },
        {
          text: "Summer",
          value: "Summer",
        },
       
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.name.includes(value as string),
      width: "30%",
    },
    {
      title: "Start Month",
      key: "startMonth",
      dataIndex: "startMonth",
      filters: 
       monthNames.map((i)=>({
        text: i,
        value: i
       }))
     
    },
    {
      title: "End Month",
      key: "endMonth",
      dataIndex: "endMonth",
    },
    {
      title: "Year",
      key: "year",
      dataIndex: "year",
    },
  ];


  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    if(extra.action === 'filter'){
      const queryParams: TQueryParam[] = [];
      filters.name?.forEach(item=> 
        queryParams.push({name: "name", value: item})
       )

       filters.startMonth?.forEach(item=> 
        queryParams.push({name: "startMonth", value: item})
       )

       setParams(queryParams);
    }

   
  };

  return (
    <Table<DataType> loading={isFetching} columns={columns} dataSource={tableData} onChange={onChange} />
  );
};

export default ManageOrder;
