import React, { useState, useEffect } from "react";
import Search from "./Search.jsx";
import Users from "./Users.jsx";
import CallsHistory from "./CallsHistory.jsx";

function Left() {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleFilterChange = (event) => {
      setFilterType(event.detail);
    };

    window.addEventListener("changeFilter", handleFilterChange);
    return () => window.removeEventListener("changeFilter", handleFilterChange);
  }, []);

  return (
    <div className="w-full h-full bg-base-300 text-base-content flex flex-col">
      <Search
        onFilterChange={setFilterType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex-1 overflow-y-auto">
        {filterType === "calls" ? (
          <CallsHistory />
        ) : (
          <Users filterType={filterType} searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
}

export default Left;
