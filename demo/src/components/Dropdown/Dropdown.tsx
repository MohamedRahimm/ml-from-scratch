import "./Dropdown.css";
import { Page } from "../../App.tsx";
// ADD TO NAVBAR
interface DropdownProps {
  currentPage: Page;
  pageNames: Page[];
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

export default function Dropdown(props: DropdownProps) {
  const pageElements = props.pageNames
    .filter((page) => page !== props.currentPage) // Filter out the current page
    .map((page) => (
      <li key={page} onClick={() => props.setCurrentPage(page)}>{page}</li>
    )); // Return each <li> with a unique key

  return (
    <div id="dropdown">
      <input type="checkbox" name="dropdown" />
      <span>
        {props.currentPage}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
      <ul>{pageElements}</ul>
    </div>
  );
}
