import { useEffect, useRef, useState } from "preact/hooks";
import "./app.css";

import axios from "axios";
import Welcome from "./components/welcome";
import NoFrameSelected from "./components/no-frame-selected";
import BuyCoffee from "./assets/buy-me-a-coffee.svg";
import { languages } from "./utils/constants";
import Home from "./components/home";
export default function App() {
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState(1);
	const [noFrames, setNoFrames] = useState(false);
	const [noTextFrames, setNoTextFrames] = useState(false);
	const [notSupported, setNotSupported] = useState(false);

	const activeLanguageValue = useRef("es");
	const activeSourceLanguage = useRef("es");
	const [formData, setFormData] = useState({
		source: "en",
		target: "es",
		q: "We want to eat",
	});

	const submitData = async (textFrom: string, node: any) => {
		setLoading(true);
		try {
			const response = await axios.post(
				import.meta.env.VITE_API_URL + "translate",
				{
					...formData,
					q: textFrom,
					source: activeSourceLanguage.current,
					target: activeLanguageValue.current,
				},
				{ headers: { "Content-Type": "application/json" } }
			);

			parent.postMessage(
				{
					pluginMessage: {
						type: "changeText",
						data: { text: response?.data?.translatedText, node: node },
					},
				},
				"*"
			);
			parent.postMessage(
				{
					pluginMessage: {
						type: "sendNotification",
						message: `Translated to ${languages.find((lt) => lt.value === activeLanguageValue.current)?.name}!`,
					},
				},
				"*"
      );
      parent.postMessage(
				{
					pluginMessage: {
						type: "detectLanguage",
					},
				},
				"*"
			);
		} catch (err: any) {
			parent.postMessage(
				{
					pluginMessage: {
						type: "sendError",
						message: err?.response?.data?.message || "Something went wrong",
					},
				},
				"*"
			);
			return null;
		} finally {
			setLoading(false);
		}
	};

	const detectLanguage = async (text: string) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_API_URL + "detect",
				{
					q: text,
				},
				{ headers: { "Content-Type": "application/json" } }
			);
			setFormData({ ...formData, source: response.data[0]?.language });
			activeSourceLanguage.current = response.data[0]?.language;
			if (
				!["es", "en", "pt", "fr", "zh", "hi"].includes(
					response.data[0]?.language
				)
			) {
				setNotSupported(true);
			} else {
				setNotSupported(false);
			}
		} catch {
			console.log("Error");
		}
	};

	const triggerGetTextOnFigma = () => {
		parent.postMessage({ pluginMessage: { type: "getText" } }, "*");
	};

	const triggerOpenCoffeeApp = () => {
		parent.postMessage(
			{
				pluginMessage: {
					type: "open-url",
					url: "https://buymeacoffee.com/lingoo", // Replace with your URL
				},
			},
			"*"
		);
	};
	useEffect(() => {
		const handleMessage = (selection: MessageEvent) => {
			let message = selection.data.pluginMessage;

			if (message.type === "isFrameSelected") {
				if (message.data.isFrameSelected && message.data.isThereTextNode) {
					setStep(3);
					setNoFrames(false);
					setNoTextFrames(false);
				} else if (!message.data.isFrameSelected) {
					setNoFrames(true);
				} else if (!message.data.isThereTextNode) {
					setNoTextFrames(true);
				}
			}
			if (message.type === "getText") {
				submitData(message.content, message.node);
			}
			if (message.type === "detectLanguage") {
				detectLanguage(message.content);
			}
		};

		window.addEventListener("message", handleMessage);

		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, []);
	useEffect(() => {
		if (step === 2) {
			parent.postMessage(
				{
					pluginMessage: {
						type: "isFrameSelected",
					},
				},
				"*"
			);
		}
	}, [step]);
	useEffect(() => {
		parent.postMessage(
			{
				pluginMessage: {
					type: "detectLanguage",
				},
			},
			"*"
		);
	}, []);
	return (
		<div className={"bg-white text-[#100F0E] h-full w-screen overflow-hidden"}>
			{step === 1 ? (
				<Welcome onConfirm={() => setStep(2)} />
			) : noFrames ? (
				<NoFrameSelected subtitle=" Select a layer to generate translated text" />
			) : noTextFrames ? (
				<div>
					<NoFrameSelected subtitle="The selected layer is not a text layer" />
				</div>
			) : notSupported ? (
				<div>
					<NoFrameSelected subtitle="Source Language is not supported " />
				</div>
			) : step === 3 ? (
				<Home
					loading={loading}
					active={activeLanguageValue.current}
					triggerGetTextOnFigma={triggerGetTextOnFigma}
					onClick={(value) => {
						setFormData({ ...formData, target: value });
						activeLanguageValue.current = value;
					}}
				/>
			) : null}
			{step !== 1 && (
				<div className={"flex justify-center mt-2"}>
					<img className={""} src={BuyCoffee} onClick={triggerOpenCoffeeApp} />
				</div>
			)}
		</div>
	);
}
