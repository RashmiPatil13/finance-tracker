import "./styles.css";
import React, { useState } from "react";
import { Button, Flex, Input, Radio, Select, Table } from "antd";
import searchImg from "../../assets/search.svg";
import { parse, unparse, parseFLoat } from "papaparse";
import { toast } from "react-toastify";

function TransactionTable({ transactions, addTransaction, fetchTransactions }) {
  // const { Option } = Select;
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedTag, setSelectedTag] = useState("");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  let filteredTransaction = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typeFilter)
  );

  // const filteredTransaction = transactions.filter((transaction) => {
  //   const searchMatch = searchTerm
  //     ? transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     : true;
  //   const tagMatch = selectedTag ? transaction.tag === selectedTag : true;
  //   const typeMatch = typeFilter ? transaction.type === typeFilter : true;

  //   return searchMatch && tagMatch && typeMatch;
  // });

  let sortedTransactions = filteredTransaction.sort((a, b) => {
    if (sortKey === "amount") {
      return a.amount - b.amount;
    } else if (sortKey === "date") {
      return new Date(a.date) - Date(b.date);
    } else {
      return;
    }
  });

  // const sortedTransactions = [...filteredTransaction].sort((a, b) => {
  //   if (sortKey === "date") {
  //     return new Date(a.date) - new Date(b.date);
  //   } else if (sortKey === "amount") {
  //     return a.amount - b.amount;
  //   } else {
  //     return 0;
  //   }
  // });

  console.log(sortedTransactions);

  function exportToCSV() {
    var csv = unparse({
      fields: ["name", "type", "tag", "date", "amount"],
      data: transactions,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importFromCSV(event) {
    event.preventDefault();
    try {
      parse(event.target.files[1], {
        header: true,
        complete: async function (result) {
          console.log("RESULT>>>", result);
          for (const item of result.data) {
            console.log("Transactions", item);
            const newTransaction = {
              ...item,
              amount: parseFloat(item.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All transaction Added!");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <>
      <div className="search-bar">
        <img style={{ width: "1rem", height: "1rem" }} src={searchImg} />
        <Input
          value={search}
          className="input"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Name"
        />
        <Select
          className="custom-input-2"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          allowClear
        >
          {/* setTypeFilter */}
          <Select.Option value="">All</Select.Option>
          <Select.Option value="income">Income</Select.Option>
          <Select.Option value="expense">Expense</Select.Option>
        </Select>
      </div>
      <div className="sort-bar">
        <h2
          style={{
            padding: "0 0.5rem",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
          }}
        >
          My Transactions
        </h2>
        <Radio.Group
          className="input-radio"
          onChange={(e) => setSortKey(e.target.value)}
          value={sortKey}
        >
          <Radio.Button value="">No Sort</Radio.Button>
          <Radio.Button value="amount">Sort by Amount</Radio.Button>
          <Radio.Button value="date"> Sort by Date</Radio.Button>
        </Radio.Group>
        <Flex gap="small" wrap="wrap">
          <button className="btn" onClick={exportToCSV}>
            Export To CSV
          </button>

          <label for="file-csv" className="btn btn-blue">
            Import from CSV
          </label>
          <input
            id="file-csv"
            type="file"
            accept=".csv"
            required
            onChange={importFromCSV}
            style={{ display: "none" }}
          />
        </Flex>
      </div>
      <div className="table-1">
        <Table
          dataSource={sortedTransactions}
          columns={columns}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30"],
          }}
        />
      </div>
      ;
    </>
  );
}

export default TransactionTable;
