import { useState } from "react";

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

const initialEmplyee = [
  { id: 1, name: "Paolo", image: "https://i.pravatar.cc/48?u=118836" },
  { id: 2, name: "Rita", image: "https://i.pravatar.cc/48?u=933372" },
  { id: 3, name: "Sara", image: "https://i.pravatar.cc/48?u=499476" },
];

export default function App() {
  const [employees, setEmployees] = useState(initialEmplyee);

  function handleAddEmployee(employee) {
    setEmployees((employees) => [...employees, employee]);
  }

  return (
    <div className="min-w-screen min-h-screen bg-ueblue-500 flex justify-center items-center p-12">
      <div className="min-w-[75vw] min-h-[75vh] bg-slate-200 flex justify-center items-center gap-12">
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
  return (
    <>
      <div className="flex flex-col gap-8 items-center p-4">
        <EmployeeList employees={employees} setEmployees={setEmployees} />
        <FormAddEmployee onAddEmployee={onAddEmployee} />
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
  const [digitalRecives, setDigitalRecives] = useLocalStorage(
    `digitalRecives-${employee.id}`,
    0
  );

  function handleAddRecive() {
    setDigitalRecives((recive) => recive + 1);
  }

  function handleRemoveRecive() {
    setDigitalRecives((recive) => recive - 1);
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
          <Button onClick={handleRemoveRecive}>-</Button>
          <span>{digitalRecives}</span>
          <Button onClick={handleAddRecive}>+</Button>
        </div>
      </div>
      <button onClick={handleDeleteEmployee}>❌</button>
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button
      className="w-8 text-center text-slate-100 aspect-square bg-ueorange-500 rounded-full"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function FormAddEmployee({ onAddEmployee }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newEmployee = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddEmployee(newEmployee);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form
      className="w-full bg-ueorange-500 flex flex-col gap-2 justify-center items-center p-2 rounded-xl"
      onSubmit={handleSubmit}
    >
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

      <Button>Add</Button>
    </form>
  );
}
