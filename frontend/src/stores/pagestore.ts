import { create } from "zustand";

type Page = "lobby" | "game";

const pageStore = create((set) => ({
  page: "",
  updatePage: (newPage: Page) => set({ page: newPage }),
  prevPage: (page: Page) => set({ page: page }),
}));

export default pageStore;
