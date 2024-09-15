/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { fetchArtworks } from "../service/artworkService";
import { Artwork } from "../types";
import { Accordion, AccordionTab } from "primereact/accordion";

const ArtworkTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
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

  // Handle row selection and deselection
  const handleRowSelection = (event: any) => {
    const selected = event.value;
    setSelectedArtworks(selected);
  };

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
        selection={selectedArtworks}
        onSelectionChange={handleRowSelection}
        dataKey="id"
        selectionMode="checkbox"
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column selectionMode="multiple" />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>
    </div>
  );
};

export default ArtworkTable;
