import { useState } from "react";

export function useFilter() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState([]);
  const [status, setStatus] = useState([]);
  const [openDifficulty, setOpenDifficulty] = useState(true);
  const [openStatus, setOpenStatus] = useState(true);

  const toggleItem = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
      return;
    }

    setState([...state, value]);
  };

  return {
    search,
    setSearch,

    difficulty,
    setDifficulty,

    status,
    setStatus,

    openDifficulty,
    setOpenDifficulty,

    openStatus,
    setOpenStatus,

    toggleItem,
  };
}