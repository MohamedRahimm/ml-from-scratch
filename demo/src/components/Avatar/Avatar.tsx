import "./Avatar.css";
interface AvatarProps {
    type: "user" | "model";
}
const map: Record<string, JSX.Element> = {
    "user": (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 20a6 6 0 0 0-12 0" />
            <circle cx="12" cy="10" r="4" />
        </svg>
    ),
    "model": (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="5.5 15.5 9 11 5.5 6.5"></polyline>
            <line x1="12" x2="18" y1="19" y2="19" />
        </svg>
    ),
};
export default function Avatar(props: AvatarProps) {
    return (
        <div className="avatar">
            {map[props.type]}
        </div>
    );
}
