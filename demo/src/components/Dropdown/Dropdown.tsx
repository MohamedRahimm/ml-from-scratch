import { useNavigate } from "react-router";
import { ConversationState, Page } from "../../definitions";
import "./Dropdown.css"
import { urlMapper } from "../../main";
import { useRef } from "react";
export interface DropdownProps {
    placeholder: string;
    options: Page[];
    setConvoState?: React.Dispatch<React.SetStateAction<ConversationState>>
}
export default function Dropdown({ placeholder, options, setConvoState }: DropdownProps) {
    const navigate = useNavigate()
    const inputRef = useRef<HTMLInputElement>(null)
    function handleNavigation(page: Page) {
        setConvoState && setConvoState({
            infoGathered: false,
            clearChat: false,
            messages: [],
            modelsUsed: [],
        })
        navigate(`${urlMapper[page]}`);
    };
    return (
        <div className="dropdown">
            <input type="checkbox" name="dropdown" ref={inputRef} />
            <span>
                {placeholder}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </span>
            <ul>
                {options.map((page, idx) => (
                    <li key={idx} onClick={() => {
                        handleNavigation(page)
                        if (inputRef.current?.checked) inputRef.current.checked = false
                    }}>
                        {page}
                    </li>
                ))}
            </ul>
        </div>
    )
}
