import { pageNames } from "../../main"
import Dropdown from "../Dropdown/Dropdown"
import "./Home.css"
export default function Home() {
    return (
        <>
            <div id="backdrop">
                <div id="dropdown-container">
                    <Dropdown placeholder="Choose a model" options={pageNames} />
                </div>
            </div>
        </>
    )
}
