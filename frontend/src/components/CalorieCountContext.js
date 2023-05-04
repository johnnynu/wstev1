import React, { createContext, useState } from 'react';

const CalorieCountContext = createContext({
    calorieCount: 0,
    addCalorieCount: () =>{},
});

export const ItemCountProvider = ({ children }) => {
  const [calorieCount, setCalorieCount] = useState(0);

  const addCalorieCount = (count) => {
    setCalorieCount((prevCount) => prevCount + count);
    console.log(count);
  };

  return (
    <CalorieCountContext.Provider value={{ calorieCount, addCalorieCount }}>
      {children}
    </CalorieCountContext.Provider>
  );
};

export default CalorieCountContext;
