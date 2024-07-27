import { useEffect, useState } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

const months = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

const currentDate = new Date();
const month = String(currentDate.getMonth());
const currentMonth = months.at(Number(month));

const initialEmployee = [
  {
    id: 1,
    name: "Test",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: { month: currentMonth, receipt: 0 },
  },
];

export default function App() {
  const [employees, setEmployees] = useLocalStorageState(
    initialEmployee,
    "employees"
  );

  function handleAddEmployee(employee) {
    setEmployees((employees) => [...employees, employee]);
  }

  useEffect(
    function () {
      localStorage.setItem("employees", JSON.stringify(employees));
    },
    [employees]
  );

  // useEffect(
  //   function () {
  //     localStorage.getItem("employees", JSON.parse(employees));
  //   },
  //   [employees]
  // );

  return (
    <div className="min-w-screen min-h-screen bg-ueblue-500 flex justify-center items-center p-12">
      <div className="min-w-[75vw] min-h-[75vh] bg-slate-200 flex justify-center items-center gap-12 rounded-xl">
        <Employees
          employees={employees}
          setEmployees={setEmployees}
          onAddEmployee={handleAddEmployee}
        />
      </div>
    </div>
  );
}

function Employees({ employees, setEmployees, onAddEmployee }) {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(currentMonth);

  return (
    <>
      <div className="flex flex-col gap-8 items-center p-4">
        {/* <select>
          {months.map((month, i) => (
            <option
              value={i}
              onChange={(e) => setMonth(e.target.value)}
              key={i}
              selected={month === currentMonth}
            >
              {month}
            </option>
          ))}
        </select> */}
        <EmployeeList
          employees={employees}
          setEmployees={setEmployees}
          setIsOpen={setIsOpen}
        />
        {!isOpen ? (
          <button
            className="w-16 text-center text-3xl text-ueorange-500 aspect-square bg-ueblue-500 rounded-full mt-16"
            onClick={() => setIsOpen(true)}
          >
            +
          </button>
        ) : (
          <FormAddEmployee
            onAddEmployee={onAddEmployee}
            setIsOpen={setIsOpen}
          />
        )}
      </div>
    </>
  );
}

function EmployeeList({ employees, setEmployees }) {
  return (
    <ul className="flex flex-col gap-4">
      {employees.map((employee) => (
        <Employee
          employee={employee}
          setEmployees={setEmployees}
          key={employee.id}
        />
      ))}
    </ul>
  );
}

function Employee({ employee, setEmployees }) {
  const [digitalReceipt, setDigitalReceipt] = useLocalStorageState(
    0,
    `digitalReceipt-${employee.id}`
  );

  function handleAddreceipt() {
    setDigitalReceipt((receipt) => receipt + 1);
  }

  function handleRemovereceipt() {
    setDigitalReceipt((receipt) => receipt - 1);
  }

  function handleDeleteEmployee() {
    setEmployees((employees) => employees.filter((e) => e.id !== employee.id));
  }

  return (
    <div className=" w-96 flex items-center justify-between">
      <div className="w-1/3 flex items-center gap-4">
        <img
          src={employee.image}
          alt={employee.name}
          className="rounded-full"
        />
        <h1>{employee.name}</h1>
      </div>
      <div>
        <h2>Scontrini Digitali</h2>
        <div className="flex justify-center items-center gap-4">
          <Button onClick={handleRemovereceipt}>-</Button>
          <span>{digitalReceipt}</span>
          <Button onClick={handleAddreceipt}>+</Button>
        </div>
      </div>
      <button onClick={handleDeleteEmployee}>❌</button>
    </div>
  );
}

function Button({ children, onClick, color = "#F07800" }) {
  return (
    <button
      className={`w-8 text-center text-slate-100 aspect-square rounded-full`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function FormAddEmployee({ onAddEmployee, setIsOpen }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newEmployee = {
      id,
      name,
      image: `${image}?u=${id}`,
      receipt: { month: currentMonth, totalreceipts: 0 },
    };

    onAddEmployee(newEmployee);

    setName("");
    setImage("https://i.pravatar.cc/48");
    setIsOpen(false);
  }

  return (
    <form
      className="w-full bg-ueorange-500 flex flex-col gap-2 justify-center items-center p-4 rounded-xl relative"
      onSubmit={handleSubmit}
    >
      <span
        className="text-slate-100 absolute top-2 right-4 cursor-pointer"
        onClick={() => setIsOpen(false)}
      >
        x
      </span>
      <label>Nome</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image URL</label>
      <input
        className="p-1"
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button color={"#002758"}>Add</Button>
    </form>
  );
}
