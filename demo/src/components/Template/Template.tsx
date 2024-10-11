import "./Template.css";
interface TemplateProps {
    title: string;
    svg: JSX.Element;
    HandleClick: () => void;
}
export default function Template(props: TemplateProps) {
    return (
        <div
            className="template"
            onClick={props.HandleClick}
        >
            <div className="icon-container">
                {props.svg}
            </div>
            {props.title}
        </div>
    );
}
