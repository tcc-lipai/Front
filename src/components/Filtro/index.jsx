import "./index.css";
import { difficulties, statusOptions } from "./types";
import { useFilter } from "./hook";

export default function Filter() {
  const {
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
  } = useFilter();

  return (
    <aside className="filter">
      <h2>Filtro</h2>

      <div className="search">
        <input
          type="text"
          placeholder="Pesquisar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="section">
        <button
          className="section-title"
          onClick={() => setOpenDifficulty(!openDifficulty)}
        >
          <span>Dificuldade</span>
          <span>{openDifficulty ? "⌃" : "⌄"}</span>
        </button>

        {openDifficulty && (
          <div className="options">
            {difficulties.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={difficulty.includes(item)}
                  onChange={() =>
                    toggleItem(item, difficulty, setDifficulty)
                  }
                />
                {item}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <button
          className="section-title"
          onClick={() => setOpenStatus(!openStatus)}
        >
          <span>Status</span>
          <span>{openStatus ? "⌃" : "⌄"}</span>
        </button>

        {openStatus && (
          <div className="options">
            {statusOptions.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={status.includes(item)}
                  onChange={() =>
                    toggleItem(item, status, setStatus)
                  }
                />
                {item}
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}