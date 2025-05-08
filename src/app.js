import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { useState } from "preact/hooks";
import "./app.css";
export function App() {
    const [count, setCount] = useState(5);
    const handleOnChange = (e) => {
        const target = e?.target;
        setCount(Number(target?.value));
    };
    const handleCreate = () => {
        parent.postMessage({ pluginMessage: { type: "create-shapes", count } }, "*");
    };
    const handleCancel = () => {
        parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
    };
    return (_jsxs(_Fragment, { children: [_jsx("h2", { children: "Rectangle Creator" }), _jsxs("p", { children: ["Count:", " ", _jsx("input", { id: "count", type: "number", value: count, onChange: handleOnChange })] }), _jsx("button", { onClick: handleCreate, id: "create", children: "Create" }), _jsx("button", { onClick: handleCancel, id: "cancel", children: "Cancel" })] }));
}
