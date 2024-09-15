/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { fetchArtworks } from "../service/artworkService";
import { Artwork } from "../types";
import Collapsible from "./Collapsible";

const ArtworkTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchArtworks(page + 1).then((data) => {
      setArtworks(data.artworks);
      setTotalRecords(data.total);
      setLoading(false);
    });
  }, [page, rowsPerPage]);

  const onPageChange = (event: any) => {
    setPage(event.page);
    setRowsPerPage(event.rows);
  };

  // Define a type for the event.value
  interface RowSelectionEvent {
    value: Artwork[];
  }

  const handleRowSelection = (event: RowSelectionEvent) => {
    // Ensure the type of event.value is Artwork[] and item.id is number
    const selectedIds = new Set<number>(event.value.map((item) => item.id));
    setSelectedRowIds(selectedIds);
  };

  const selectRowsBasedOnInput = async (count: number) => {
    const rowsToSelect: Artwork[] = [];
    let totalSelected = selectedRowIds.size;

    const fetchPageData = async (pageIndex: number) => {
      try {
        const data = await fetchArtworks(pageIndex + 1);
        const availableRows = data.artworks;
        const rowsNeeded = count - totalSelected;

        const rowsToAdd = availableRows
          .filter((row) => !selectedRowIds.has(row.id))
          .slice(0, rowsNeeded);

        rowsToSelect.push(...rowsToAdd);
        totalSelected += rowsToAdd.length;

        if (totalSelected >= count) {
          const newSelectedIds = new Set<number>(
            rowsToSelect.map((row) => row.id)
          );
          setSelectedRowIds((prev) => new Set([...prev, ...newSelectedIds]));
          return true;
        }

        return false;
      } catch (error) {
        console.error("Error fetching page data:", error);
        return false;
      }
    };

    const processPages = async () => {
      for (let i = 0; i <= Math.floor(totalRecords / rowsPerPage); i++) {
        const done = await fetchPageData(i);
        if (done) break;
      }
    };

    processPages();
  };

  const isRowSelected = (rowId: number): boolean => selectedRowIds.has(rowId);

  const header = (
    <div style={{ position: "relative", top: 34, left: 30 }}>
      <Collapsible onSelectRows={selectRowsBasedOnInput} />
    </div>
  );

  return (
    <div>
      <DataTable
        value={artworks}
        loading={loading}
        paginator
        rows={rowsPerPage}
        rowsPerPageOptions={[4, 8, 12]}
        first={page * rowsPerPage}
        totalRecords={totalRecords}
        lazy
        onPage={onPageChange}
        selection={artworks.filter((row) => isRowSelected(row.id))}
        onSelectionChange={handleRowSelection}
        dataKey="id"
        selectionMode="checkbox"
        tableStyle={{ minWidth: "50rem" }}
        header={header}
      >
        <Column selectionMode="multiple" style={{ width: "6%" }} />
        <Column field="title" header="Title" style={{ width: "20%" }} />
        <Column
          field="place_of_origin"
          style={{ width: "20%" }}
          header="Place of Origin"
        />
        <Column
          field="artist_display"
          style={{ width: "20%" }}
          header="Artist"
        />
        <Column
          field="inscriptions"
          style={{ width: "20%" }}
          header="Inscriptions"
        />
        <Column
          field="date_start"
          style={{ width: "7%" }}
          header="Start Date"
        />
        <Column field="date_end" style={{ width: "7%" }} header="End Date" />
      </DataTable>
    </div>
  );
};

export default ArtworkTable;
