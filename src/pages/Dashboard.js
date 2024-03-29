import React, { useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { useEffect } from "react";

// import { Modal } from "antd";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addincome";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { db, auth } from "../firebase";
import { collection, addDoc, query, getDocs } from "firebase/firestore";
import TransactionTable from "../components/TransactionTable";
import Charts from "../components/Charts/Charts";
import NoTransactions from "../components/NoTransactions";

function Dashboard() {
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  const handleExpenseModal = () => {
    setIsExpenseModalVisible(false);
  };
  const handleIncomeModal = () => {
    setIsIncomeModalVisible(false);
  };
  const onFinish = (values, type) => {
    console.log("On Finish", values, type);
    const newTransaction = {
      type: type,
      date: values.date.format("DD-MM-YYYY"),
      amount: values.amount,
      name: values.name,
      tag: values.tag,
    };
    console.log("New Transaction", newTransaction);
    addTransaction(newTransaction);
  };

  async function addTransaction(newTransaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        newTransaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transaction Added!");
      let newArr = transaction;
      newArr.push(newTransaction);
      setTransaction(newArr);
      calculateBalance();
      toast.success("Transaction added!");
    } catch (e) {
      console.log("Error adding document: ", e);
      if (!many) toast.error("Couldn't add transaction!");
    }
  }

  useEffect(() => {
    // Get all Docs from a collection
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transaction]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transaction.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      const transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data is never undefined for query doc snapshot
        transactionsArray.push(doc.data());
      });
      setTransaction(transactionsArray);
      console.log(transactionsArray);
      toast.success("Transaction fetched");
    }
    setLoading(false);
  }

  let sortedTransactions = transaction.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  console.log(transaction, "and", sortedTransactions);

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />

          {transaction.length === 0 ? (
            <NoTransactions />
          ) : (
            <Charts sortedTransactions={sortedTransactions} />
          )}
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseModal={handleExpenseModal}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeModal={handleIncomeModal}
            onFinish={onFinish}
          />
          <TransactionTable
            transactions={transaction}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
