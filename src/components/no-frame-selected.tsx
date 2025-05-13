
import DefaultLogo from '../assets/logo-without-flags.svg'
const NoFrameSelected = ({ subtitle }: { subtitle:string}) => {
  return (
		<div className={"flex justify-center mt-[121px] h-full"}>
			<div>
				<div className={"flex justify-center"}>
					<img className={"w-[80px] h-[80px]"} src={DefaultLogo} alt={"#"} />
				</div>
				<p className={"mt-[32px] text-sm text-[#4C4743]"}>{subtitle}</p>
			</div>
		</div>
	);
}

export default NoFrameSelected