import { keepPreviousData, useQuery } from "@tanstack/react-query";
import css from "./App.module.css";
import { fetchNotes } from "../../services/noteService";
import { useState } from "react";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  const { data } = useQuery({
    queryKey: ["notes", searchValue, currentPage],
    queryFn: () => fetchNotes(searchValue, currentPage),
    placeholderData: keepPreviousData,
  });

  const handleSearch = useDebouncedCallback((query) => {
    setSearchValue(query);
    setCurrentPage(1);
  }, 1000);
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        {/* Кнопка створення нотатки */}
      </header>
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
};

export default App;
