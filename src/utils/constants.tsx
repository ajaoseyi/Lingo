import FrenchIcon from "../assets/france.svg";
import MadarinIcon from "../assets/china.svg";
import SpanishIcon from "../assets/spain.svg";
import PortugeseIcon from "../assets/portugal.svg";
import IndiaIcon from "../assets/india.png";
import EnglishIcon from "../assets/united-kingdom.svg"


export const languages = [
	{
		name: "English",
		icon: <img className={"rounded-full"} src={EnglishIcon} />,
		value: "en",
	},
	{
		name: "French",
		icon: <img className={"rounded-full"} src={FrenchIcon} />,
		value: "fr",
	},
	{
		name: "Spanish",
		icon: <img className={"rounded-full"} src={SpanishIcon} />,
		value: "es",
	},
	{
		name: "Madarin ",
		icon: <img className={"rounded-full"} src={MadarinIcon} />,
		value: "zh",
	},
	{
		name: "Portugese",
		icon: <img className={"rounded-full"} src={PortugeseIcon} />,
		value: "pt",
	},
	{
		name: "Hindi",
		icon: <img className={"rounded-full"} src={IndiaIcon} />,
		value: "hi",
	},
];
